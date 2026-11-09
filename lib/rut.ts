// RUT chileno: cuerpo numérico + dígito verificador (módulo 11).

function limpiar(rut: string) {
  return rut.replace(/[.\s-]/g, "").toUpperCase();
}

export function digitoVerificador(cuerpo: string) {
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const dv = 11 - (suma % 11);
  return dv === 11 ? "0" : dv === 10 ? "K" : String(dv);
}

export function validarRut(rut: string) {
  const r = limpiar(rut);
  if (!/^\d{7,8}[\dK]$/.test(r)) return false;
  return digitoVerificador(r.slice(0, -1)) === r.slice(-1);
}

/** "123456785" → "12.345.678-5". Si no tiene forma de RUT, lo devuelve tal cual. */
export function formatearRut(rut: string) {
  const r = limpiar(rut);
  if (!/^\d{7,8}[\dK]$/.test(r)) return rut;
  const cuerpo = r.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpo}-${r.slice(-1)}`;
}
