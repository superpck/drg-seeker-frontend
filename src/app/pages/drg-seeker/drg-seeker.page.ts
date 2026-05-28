import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Config from '../../configs/config';
import { DrgSearchRequestPayload, DrgSearchResponse, DrgService, InsclCode } from '../../services/drg.service';
import { HisIpdFormValue, HisService } from '../../services/his.service';
import { LoginService } from '../../services/login.service';
import { PkIcon, PkToastrService } from 'ngx-pk-ui';

@Component({
  selector: 'app-drg-seeker-page',
  templateUrl: './drg-seeker.page.html',
  styleUrl: './drg-seeker.page.scss',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    PkIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrgSeekerPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly drgService = inject(DrgService);
  private readonly hisService = inject(HisService);
  private readonly loginService = inject(LoginService);
  private readonly toastrService = inject(PkToastrService);

  readonly sdxIndexes = Array.from({ length: 12 }, (_, index) => index + 1);
  readonly procIndexes = Array.from({ length: 20 }, (_, index) => index + 1);
  readonly insclOptions: InsclCode[] = ['UC', 'SSS', 'CS', 'CASH'];

  readonly config = Config;
  readonly authUser = this.loginService.authUser;
  readonly loading = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly response = signal<DrgSearchResponse | null>(null);
  readonly requestPreview = signal<DrgSearchRequestPayload | null>(null);
  readonly warningMessages = signal<string[]>([]);

  private readonly drgErrorMessages: Record<string, string> = {
    '1': 'No principal diagnosis',
    '2': 'Invalid principal diagnosis',
    '3': 'Unacceptable principal diagnosis',
    '4': 'Principal diagnosis not valid for age',
    '5': 'Principal diagnosis not valid for sex',
    '6': 'Age error',
    '7': 'Ungroupable due to sex error',
    '8': 'Ungroupable due to discharge type error',
    '9': 'Length of stay error',
    '10': 'Ungroupable due to admission weight error'
  };

  private readonly drgWarningFlags: Record<number, string> = {
    1: 'SDx ใช้ไม่ได้ หรือซ้ำกับ PDx หรือซ้ำกันเอง',
    2: 'SDx ไม่เหมาะกับอายุ',
    4: 'SDx ไม่เหมาะกับเพศ หรือเป็นรหัสสำหรับเพศใดเพศหนึ่ง แต่ไม่มีข้อมูลเพศ',
    8: 'Proc ใช้ไม่ได้ หรือซ้ำกันเอง',
    16: 'Proc ไม่เหมาะกับเพศ หรือเป็นรหัสสำหรับเพศใดเพศหนึ่ง แต่ไม่มีข้อมูลเพศ',
    32: 'ไม่มีข้อมูลเพศ หรือใช้รหัสนอกเหนือจากที่กำหนด',
    64: 'ไม่มีประเภทการจำหน่ายออกจากโรงพยาบาล หรือใช้รหัสนอกเหนือจากที่กำหนด',
    128: 'ไม่มีวันที่ และ/หรือ เวลา ที่รับไว้ในโรงพยาบาล หรือ มีแต่ไม่ถูกต้อง',
    256: 'ไม่มีวันที่ และ/หรือ เวลา ที่จำหน่ายออกจากโรงพยาบาล หรือ มีแต่ไม่ถูกต้อง'
  };

  readonly form = this.formBuilder.nonNullable.group({
    an: this.formBuilder.nonNullable.control(''),
    hn: this.formBuilder.nonNullable.control(''),
    sex: this.formBuilder.nonNullable.control<'1' | '2'>('1', [Validators.required]),
    age: this.formBuilder.nonNullable.control(0, [Validators.min(0), Validators.max(124)]),
    ageday: this.formBuilder.nonNullable.control(0, [Validators.min(0), Validators.max(365)]),
    los: this.formBuilder.nonNullable.control(1, [Validators.required, Validators.min(0)]),
    discht: this.formBuilder.nonNullable.control('', [Validators.required]),
    admwt: this.formBuilder.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    pdx: this.formBuilder.nonNullable.control('', [Validators.required]),
    inscl: this.formBuilder.nonNullable.control<InsclCode>('UC', [Validators.required]),
    price: this.formBuilder.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    sdx1: this.formBuilder.nonNullable.control(''),
    sdx2: this.formBuilder.nonNullable.control(''),
    sdx3: this.formBuilder.nonNullable.control(''),
    sdx4: this.formBuilder.nonNullable.control(''),
    sdx5: this.formBuilder.nonNullable.control(''),
    sdx6: this.formBuilder.nonNullable.control(''),
    sdx7: this.formBuilder.nonNullable.control(''),
    sdx8: this.formBuilder.nonNullable.control(''),
    sdx9: this.formBuilder.nonNullable.control(''),
    sdx10: this.formBuilder.nonNullable.control(''),
    sdx11: this.formBuilder.nonNullable.control(''),
    sdx12: this.formBuilder.nonNullable.control(''),
    proc1: this.formBuilder.nonNullable.control(''),
    proc2: this.formBuilder.nonNullable.control(''),
    proc3: this.formBuilder.nonNullable.control(''),
    proc4: this.formBuilder.nonNullable.control(''),
    proc5: this.formBuilder.nonNullable.control(''),
    proc6: this.formBuilder.nonNullable.control(''),
    proc7: this.formBuilder.nonNullable.control(''),
    proc8: this.formBuilder.nonNullable.control(''),
    proc9: this.formBuilder.nonNullable.control(''),
    proc10: this.formBuilder.nonNullable.control(''),
    proc11: this.formBuilder.nonNullable.control(''),
    proc12: this.formBuilder.nonNullable.control(''),
    proc13: this.formBuilder.nonNullable.control(''),
    proc14: this.formBuilder.nonNullable.control(''),
    proc15: this.formBuilder.nonNullable.control(''),
    proc16: this.formBuilder.nonNullable.control(''),
    proc17: this.formBuilder.nonNullable.control(''),
    proc18: this.formBuilder.nonNullable.control(''),
    proc19: this.formBuilder.nonNullable.control(''),
    proc20: this.formBuilder.nonNullable.control('')
  });

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  async onAnChange() {
    const an = this.form.controls.an.value.trim();
    if (!an) {
      return;
    }

    const ipd = await this.hisService.getIpd(an);
    this.form.patchValue(ipd as Partial<HisIpdFormValue>);
  }

  onSubmit() {
    if (this.loading()) {
      return;
    }

    const isAgeOrAgeDayValid = this.isAgeOrAgeDayValid();
    if (this.form.invalid || !isAgeOrAgeDayValid) {
      this.form.markAllAsTouched();
      if (!isAgeOrAgeDayValid) {
        this.toastrService.warning('กรุณากรอก Age (0-124) หรือ Age Day (0-365)', 'ขาดข้อมูลสำคัญ!', { progress: true });
        return;
      }

      const missingFields = this.getMissingRequiredFields();
      const message = missingFields.length > 0
        ? `กรุณากรอกข้อมูลบังคับ: ${missingFields.join(', ')}`
        : 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
      this.toastrService.warning(message, 'ขาดข้อมูลสำคัญ!', { progress: true });
      return;
    }

    const payload = this.toPayload();
    this.loading.set(true);
    this.submitError.set(null);
    this.requestPreview.set(payload);

    console.log('Submitting DRG search with payload:', payload);
    this.drgService.search(payload).subscribe({
      next: async (result) => {
        try {
          const drgErrorMessage = this.getDrgErrorMessage(result.err);
          if (drgErrorMessage) {
            this.response.set(null);
            this.submitError.set(`DRG Error ${result.err}: ${drgErrorMessage}`);
            this.toastrService.error(`DRG Error ${result.err}: ${drgErrorMessage}`, 'คำนวณ DRG ไม่สำเร็จ', {
              progress: true
            });
            return;
          }

          this.response.set(result);

          const warnings = this.decodeWarningCode(result.warn);
          this.warningMessages.set(warnings);
          if (warnings.length > 0) {
            this.toastrService.warning(
              warnings.join('; '),
              `พบคำเตือน (${warnings.length})`,
              { progress: true }
            );
          }

          if (this.config.saveHIS) {
            const an = this.form.controls.an.value.trim();
            try {
              await this.hisService.saveIPD({
                an,
                request: payload,
                response: result,
                savedAt: new Date().toISOString()
              });
            } catch {
              this.toastrService.warning('คำนวณ DRG สำเร็จ แต่บันทึก HIS ไม่สำเร็จ', 'บันทึก HIS ล้มเหลว', {
                progress: true
              });
            }
          }

          console.log('Received DRG search response:', result);
        } catch {
          this.response.set(null);
          this.submitError.set('Response format is invalid. Please check API response.');
          this.toastrService.error('Response format is invalid. Please check API response.', 'คำนวณ DRG ไม่สำเร็จ', {
            progress: true
          });
        } finally {
          this.loading.set(false);
        }
      },
      error: () => {
        this.submitError.set('Cannot calculate DRG right now. Please try again.');
        this.loading.set(false);
      }
    });
  }

  shouldShowSdx(index: number) {
    return this.shouldShowSequentialField('sdx', index);
  }

  shouldShowProc(index: number) {
    return this.shouldShowSequentialField('proc', index);
  }

  private toPayload(): DrgSearchRequestPayload {
    const value = this.form.getRawValue();

    return {
      hn: value.hn.trim(),
      an: value.an.trim(),
      sex: value.sex,
      age: value.age,
      ageday: value.ageday,
      los: value.los,
      discht: value.discht.trim(),
      admwt: value.admwt,
      pdx: value.pdx.trim().toUpperCase(),
      inscl: value.inscl,
      price: value.price,
      sdx1: value.sdx1.trim().toUpperCase(),
      sdx2: value.sdx2.trim().toUpperCase(),
      sdx3: value.sdx3.trim().toUpperCase(),
      sdx4: value.sdx4.trim().toUpperCase(),
      sdx5: value.sdx5.trim().toUpperCase(),
      sdx6: value.sdx6.trim().toUpperCase(),
      sdx7: value.sdx7.trim().toUpperCase(),
      sdx8: value.sdx8.trim().toUpperCase(),
      sdx9: value.sdx9.trim().toUpperCase(),
      sdx10: value.sdx10.trim().toUpperCase(),
      sdx11: value.sdx11.trim().toUpperCase(),
      sdx12: value.sdx12.trim().toUpperCase(),
      proc1: value.proc1.trim().toUpperCase(),
      proc2: value.proc2.trim().toUpperCase(),
      proc3: value.proc3.trim().toUpperCase(),
      proc4: value.proc4.trim().toUpperCase(),
      proc5: value.proc5.trim().toUpperCase(),
      proc6: value.proc6.trim().toUpperCase(),
      proc7: value.proc7.trim().toUpperCase(),
      proc8: value.proc8.trim().toUpperCase(),
      proc9: value.proc9.trim().toUpperCase(),
      proc10: value.proc10.trim().toUpperCase(),
      proc11: value.proc11.trim().toUpperCase(),
      proc12: value.proc12.trim().toUpperCase(),
      proc13: value.proc13.trim().toUpperCase(),
      proc14: value.proc14.trim().toUpperCase(),
      proc15: value.proc15.trim().toUpperCase(),
      proc16: value.proc16.trim().toUpperCase(),
      proc17: value.proc17.trim().toUpperCase(),
      proc18: value.proc18.trim().toUpperCase(),
      proc19: value.proc19.trim().toUpperCase(),
      proc20: value.proc20.trim().toUpperCase()
    };
  }

  private shouldShowSequentialField(prefix: 'sdx' | 'proc', index: number) {
    if (index <= 1) {
      return true;
    }

    const previousValue = this.getTextControlValue(`${prefix}${index - 1}`);
    return previousValue.trim().length > 0;
  }

  private getTextControlValue(controlName: string) {
    return (this.form.get(controlName)?.value as string | undefined) ?? '';
  }

  private getMissingRequiredFields() {
    const requiredFields: Array<{ controlName: string; label: string }> = [
      { controlName: 'sex', label: 'Sex' },
      { controlName: 'age', label: 'Age' },
      { controlName: 'discht', label: 'Discharge Type' },
      { controlName: 'los', label: 'LOS' },
      { controlName: 'pdx', label: 'Primary Diagnosis (PDX)' }
    ];

    return requiredFields
      .filter(({ controlName }) => this.form.get(controlName)?.hasError('required'))
      .map(({ label }) => label);
  }

  private isAgeOrAgeDayValid() {
    const age = this.form.controls.age.value;
    const ageday = this.form.controls.ageday.value;

    const isAgeInRange = age >= 0 && age <= 124;
    const isAgeDayInRange = ageday >= 0 && ageday <= 365;
    return isAgeInRange || isAgeDayInRange;
  }

  private getDrgErrorMessage(errorCode: unknown) {
    const normalizedCode = String(errorCode ?? '').trim();
    if (!normalizedCode || normalizedCode === '0') {
      return null;
    }

    return this.drgErrorMessages[normalizedCode] ?? 'Unknown DRG error';
  }

  private decodeWarningCode(warnCode: unknown): string[] {
    const warnings: string[] = [];
    const code = Number(warnCode ?? 0);

    if (!code || isNaN(code)) {
      return warnings;
    }

    for (const [flag, message] of Object.entries(this.drgWarningFlags)) {
      const flagNum = Number(flag);
      if ((code & flagNum) === flagNum) {
        warnings.push(message);
      }
    }

    return warnings;
  }
}
