import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
    return this.http.post<DrgSearchResponse>(`${this.url}/seeker`, {
      version: '6',
      data: [this.toParams(payload)]
    });
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

}
