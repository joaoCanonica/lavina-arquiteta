import { aviso, confirmado, opcional } from './tipos.ts';

const CAU_MOTIVO = 'ainda não há número (decisão do João: aviso, vai para a conferência final)';

export const pessoas = [
  {
    id: 'amanda-lavina',
    nome: confirmado('Amanda Lavina', 'João; Instagram @lavinamanda'),
    nomeRegistro: confirmado('Amanda Oliveira Lavina', 'Receita Federal (sócia-administradora)'),
    papel: confirmado('Arquiteta líder', 'João; Receita Federal (sócia-administradora)'),
    lider: true,
    instagram: confirmado('@lavinamanda', 'Instagram'),
    cau: aviso('CAU de Amanda Lavina', CAU_MOTIVO),
    formacao: opcional<string>(), // João, 23/10/2026: formação e papel não precisam aparecer
    retrato: confirmado(
      'retrato-amanda-02',
      'media.manifest.json (ensaio de @sabrinarodriguesfoto)',
    ),
  },
  {
    id: 'renata-nurnberg',
    nome: confirmado('Renata Nürnberg', 'Instagram @arq_renatanurnberg'),
    nomeRegistro: opcional<string>(),
    papel: confirmado(
      'Arquiteta e urbanista · interiores e imagens realistas',
      'bio do Instagram @arq_renatanurnberg',
    ),
    lider: false,
    instagram: confirmado('@arq_renatanurnberg', 'Instagram'),
    cau: aviso('CAU de Renata Nürnberg', CAU_MOTIVO),
    formacao: opcional<string>(), // João, 23/10/2026: formação e papel não precisam aparecer
    retrato: confirmado('retrato-renata-01', 'media.manifest.json (texto queimado na imagem)'),
  },
  {
    id: 'lara-honofre',
    nome: confirmado('Lara Honofre', 'Instagram @honofrelara'),
    nomeRegistro: opcional<string>(),
    papel: confirmado('Arquitetura e urbanismo', 'bio do Instagram @honofrelara'),
    lider: false,
    instagram: confirmado('@honofrelara', 'Instagram'),
    cau: aviso('CAU de Lara Honofre', CAU_MOTIVO),
    formacao: opcional<string>(), // João, 23/10/2026: formação e papel não precisam aparecer
    retrato: confirmado('retrato-lara-01', 'media.manifest.json (texto queimado na imagem)'),
  },
] as const;

export const cauEmpresa = aviso('CAU da pessoa jurídica', CAU_MOTIVO);
