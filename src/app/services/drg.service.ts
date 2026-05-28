import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import CONFIG from '../configs/config';

export type SexCode = '1' | '2';
export type InsclCode = 'UC' | 'SSS' | 'CS' | 'CASH';
type SdxIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ProcIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
type SdxKey = `sdx${SdxIndex}`;
type ProcKey = `proc${ProcIndex}`;

export interface DrgSearchRequest {
  an: string;
  hn: string;
  sex: SexCode;
  age: any;
  ageday: any;
  los: number;
  discht: string;
  admwt: number;
  pdx: string;
  inscl: InsclCode;
  price: number;
}

export type DrgSearchRequestPayload = DrgSearchRequest & Record<SdxKey, string> & Record<ProcKey, string>;

export interface DrgSearchResponse {
  an?: string;
  hn?: string;
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
  an?: string;
  hn?: string;
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

  search(payload: DrgSearchRequestPayload) {
    return this.http
      .post<DrgApiResponse>(`${this.url}/seeker`, {
        version: '6',
        data: [this.toParams(payload)]
      })
      .pipe(map((response) => this.toSearchResponse(response)));
  }

  private toParams(payload: DrgSearchRequestPayload) {
    const fields: Record<string, string | number> = {
      hn: payload?.hn,
      an: payload?.an,
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

    for (let index = 1 as SdxIndex; index <= 12; index++) {
      const key = `sdx${index}` as SdxKey;
      fields[key] = payload[key] ?? '';
    }

    for (let index = 1 as ProcIndex; index <= 20; index++) {
      const key = `proc${index}` as ProcKey;
      fields[key] = payload[key] ?? '';
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