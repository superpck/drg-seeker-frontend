import { Injectable } from '@angular/core';
import Config from '../configs/config';
import type { DrgSearchRequestPayload, DrgSearchResponse } from './drg.service';

export interface HisIpdFormValue {
  an: string;
  sex: '1' | '2';
  age: number;
  ageday: number;
  los: number;
  discht: string;
  admwt: number;
  pdx: string;
  inscl: 'UC' | 'SSS' | 'CS' | 'CASH';
  price: number;
  sdx1: string;
  sdx2: string;
  sdx3: string;
  sdx4: string;
  sdx5: string;
  sdx6: string;
  sdx7: string;
  sdx8: string;
  sdx9: string;
  sdx10: string;
  sdx11: string;
  sdx12: string;
  proc1: string;
  proc2: string;
  proc3: string;
  proc4: string;
  proc5: string;
  proc6: string;
  proc7: string;
  proc8: string;
  proc9: string;
  proc10: string;
  proc11: string;
  proc12: string;
  proc13: string;
  proc14: string;
  proc15: string;
  proc16: string;
  proc17: string;
  proc18: string;
  proc19: string;
  proc20: string;
}

export interface HisSaveIpdPayload {
  an: string;
  request: DrgSearchRequestPayload;
  response: DrgSearchResponse;
  savedAt: string;
}

@Injectable({ providedIn: 'root' })
export class HisService {
  url = Config.apiHis;

  async getIpd(an: string | null): Promise<Partial<HisIpdFormValue>> {
    /*
      แก้ไขให้เรียก API จริงที่นี่
      เช่น return this.http.get(`${this.url}/api/ipd/${an}`).pipe(delay(500));
    */
    void an; // ป้องกัน unused parameter error ลบบออกเมื่อเรียก API จริงได้แล้ว
    return {};
  }

  async saveIPD(payload: HisSaveIpdPayload): Promise<{ success: boolean }> {
    /*
      แก้ไขให้เรียก API จริงที่นี่
      เช่น return firstValueFrom(this.http.post(`${this.url}/api/ipd/save`, payload));
    */
    void payload;
    return { success: true };
  }
}
