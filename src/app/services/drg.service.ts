import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import CONFIG from '../configs/config';

export type SexCode = '1' | '2';
export type InsclCode = 'UC' | 'SSS' | 'CS' | 'CASH';

export interface DrgSearchRequest {
  sex: SexCode;
  age: any;
  ageday: any;
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
  status: string;
  tgrp: {
    fileName: string;
    fileDescription: string;
    productVersion: string;
  };
}

interface DrgApiDataRow {
  drg?: string;
  rw?: number;
  adjrw?: number;
  wtlos?: number;
  ot?: string;
  err?: string;
  warn?: string;
}

interface DrgApiTgrp {
  FileName?: string;
  metadata?: string;
}

interface DrgApiResponse {
  status?: string;
  data?: DrgApiDataRow[];
  tgrp?: DrgApiTgrp;
}

interface DrgTgrpMetadata {
  FileDescription?: string;
  ProductVersion?: string;
}

@Injectable({ providedIn: 'root' })
export class DrgService {
  private readonly http = inject(HttpClient);
  private readonly url = CONFIG.apiBaseUrl;

  search(payload: DrgSearchRequest) {
    return this.http
      .post<DrgApiResponse>(`${this.url}/seeker`, {
        version: '6',
        data: [this.toParams(payload)]
      })
      .pipe(map((response) => this.toSearchResponse(response)));
  }

  private toParams(payload: DrgSearchRequest) {
    const fields: Record<string, string | number> = {
      sex: payload.sex,
      age: payload.age.toString(),
      ageday: payload.ageday.toString(),
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

  private toSearchResponse(response: DrgApiResponse): DrgSearchResponse {
    const row = response.data?.[0] ?? {};
    const metadata = this.parseTgrpMetadata(response.tgrp?.metadata);

    return {
      drg: row.drg ?? '',
      rw: row.rw ?? 0,
      adjrw: row.adjrw ?? 0,
      wtlos: row.wtlos ?? 0,
      ot: row.ot ?? '',
      err: row.err ?? '',
      warn: row.warn ?? '',
      status: response.status ?? '',
      tgrp: {
        fileName: response.tgrp?.FileName ?? '',
        fileDescription: metadata.FileDescription ?? '',
        productVersion: metadata.ProductVersion ?? ''
      }
    };
  }

  private parseTgrpMetadata(metadataRaw: string | undefined): DrgTgrpMetadata {
    if (!metadataRaw) {
      return {};
    }

    try {
      return JSON.parse(metadataRaw) as DrgTgrpMetadata;
    } catch {
      return {};
    }
  }

}
