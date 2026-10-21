import { aviso, confirmado } from './tipos.ts';

export type Dia = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
export type Horario = { dias: Dia[]; abre: string; fecha: string } | { dias: Dia[]; fechado: true };

export const contato = {
  endereco: confirmado(
    {
      logradouro: 'Av. Pres. Vargas, 505',
      bairro: 'Sagrado Coração de Jesus',
      cidade: 'Lages',
      uf: 'SC',
      cep: '88508-110',
    },
    'João (pacote §A) e ficha do Google Maps',
  ),
  enderecoDivergencia: aviso(
    'Endereço da Receita diverge do Google',
    'Receita: Rua Lourenço Teodoro Waltrick, 505, CEP 88508-170 (prédio de esquina); o site usa o do Google, confirmado pelo João',
  ),
  geo: confirmado({ lat: -27.8109211, lng: -50.3161973 }, 'ficha do Google Maps (investigação §2)'),
  horarios: confirmado<Horario[]>(
    [
      { dias: ['seg', 'ter', 'qua', 'qui', 'sex'], abre: '09:00', fecha: '19:00' },
      { dias: ['sab', 'dom'], fechado: true },
    ],
    'João e ficha do Google Maps',
  ),
  // Trava de produção: sem WhatsApp, não publica.
  whatsapp: confirmado('5549991900821', 'João; botão do Linktree amandalavina'),
  instagram: confirmado(
    [
      { usuario: '@lavina.co.arq', url: 'https://www.instagram.com/lavina.co.arq/' },
      { usuario: '@lavinamanda', url: 'https://www.instagram.com/lavinamanda/' },
    ],
    'Instagram (investigação §2)',
  ),
  mapsUrl: confirmado(
    'https://www.google.com/maps/place/Amanda+Lavina+Arquitetura/@-27.8109211,-50.3161973,17z',
    'ficha "Amanda Lavina Arquitetura" no Google Maps',
  ),
  email: aviso('E-mail de contato', 'não informado (investigação §13.9)'),
  acessibilidade: confirmado(
    'Estacionamento acessível para cadeira de rodas',
    'aba Sobre da ficha do Google Maps',
  ),
} as const;

export const linkWhatsapp = (numero: string, mensagem?: string): string =>
  `https://wa.me/${numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`;
