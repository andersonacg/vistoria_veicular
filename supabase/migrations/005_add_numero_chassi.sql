-- Adiciona campo para o número do chassi (VIN), 17 caracteres alfanuméricos
alter table vistorias
  add column numero_chassi text;
