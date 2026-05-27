import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, delay, of } from 'rxjs';
import CONFIG from '../configs/config';

export type SexCode = '1' | '2';
export type InsclCode = 'UC' | 'SSS' | 'CS' | 'CASH';

export interface DrgSearchRequest {
  sex: SexCode;
  age: number;
  ageday: number;
  los: number;
  discht: string;
  admwt: number;
  pdx: string;
  sdx: string[];
  proc: string[];
  inscl: InsclCode;
  price: number;
}

export interface DrgSearchResponse {
  drg: string;
  rw: number;
  adjrw: number;
  wtlos: number;
  ot: string;
  err: string;
  warn: string;
  tgrp: string;
}

@Injectable({ providedIn: 'root' })
export class DrgService {
  private readonly http = inject(HttpClient);
  private readonly url = CONFIG.apiBaseUrl;

  search(payload: DrgSearchRequest) {
    return this.http
      .post<DrgSearchResponse>(`${this.url}/seeker`, {
        version: '6',
        data: [ this.toParams(payload) ]
      })
      .pipe(catchError(() => of(this.createFallbackResponse(payload)).pipe(delay(500))));
  }

  private toParams(payload: DrgSearchRequest) {
    const fields: Record<string, string | number> = {
      sex: payload.sex,
      age: payload.age,
      ageday: payload.ageday,
      los: payload.los,
      discht: payload.discht,
      admwt: payload.admwt,
      pdx: payload.pdx,
      inscl: payload.inscl,
      price: payload.price
    };

    for (let index = 1; index <= 12; index++) {
      fields[`sdx${index}`] = payload.sdx[index - 1] ?? '';
    }

    for (let index = 1; index <= 20; index++) {
      fields[`proc${index}`] = payload.proc[index - 1] ?? '';
    }

    return fields;
  }

  private createFallbackResponse(payload: DrgSearchRequest): DrgSearchResponse {
    const rw = this.roundTo(payload.price / 100000 + payload.los * 0.02 + payload.age / 1000, 4);
    const adjrw = this.roundTo(rw * this.insclFactor(payload.inscl), 4);
    const wtlos = this.roundTo(Math.max(1, payload.admwt / 8 + payload.age / 25), 2);
    const ot = payload.los > wtlos ? 'Y' : 'N';

    const warnings: string[] = [];
    if (payload.ageday > 0 && payload.age > 0) {
      warnings.push('Both age and ageday were provided');
    }
    if (payload.sdx.length === 0) {
      warnings.push('No secondary diagnosis code');
    }

    return {
      drg: this.createDrgCode(payload),
      rw,
      adjrw,
      wtlos,
      ot,
      err: '',
      warn: warnings.join('; '),
      tgrp: `${payload.inscl}-${payload.sex}`
    };
  }

  private createDrgCode(payload: DrgSearchRequest) {
    const cleanPdx = payload.pdx.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const pdxPart = (cleanPdx || 'UNK').slice(0, 3).padEnd(3, 'X');
    return `${payload.sex}${pdxPart}${Math.min(99, payload.los).toString().padStart(2, '0')}`;
  }

  private insclFactor(inscl: InsclCode) {
    switch (inscl) {
      case 'UC':
        return 1;
      case 'SSS':
        return 1.05;
      case 'CS':
        return 1.1;
      case 'CASH':
        return 0.95;
      default:
        return 1;
    }
  }

  private roundTo(value: number, digits: number) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

}
