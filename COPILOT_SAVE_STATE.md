# Copilot Save State

Last updated: 2026-05-28

## Current Status

- DRG seeker form is connected with AN onchange lookup.
- `onAnChange()` in DRG page calls `HisService.getIpd(an)` and patches returned values into form.
- `HisService.getIpd()` is intentionally a fake stub returning `{}`.

## Integration Contract

HIS lookup should return `Partial<HisIpdFormValue>` where keys match form controls:

- `an`, `sex`, `age`, `ageday`, `los`, `discht`, `admwt`, `pdx`, `inscl`, `price`
- `sdx1..sdx12`
- `proc1..proc20`

## Next Action For Dev Team

- Replace stub in `src/app/services/his.service.ts` with real hospital API call.
- Map API response fields to `HisIpdFormValue` keys before returning.
- Keep nullable or unknown fields omitted instead of forcing empty values.

## Related Files

- `src/app/pages/drg-seeker/drg-seeker.page.ts`
- `src/app/pages/drg-seeker/drg-seeker.page.html`
- `src/app/services/his.service.ts`
- `CHANGELOG.md`
- `README.md`
