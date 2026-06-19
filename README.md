# Vistoria Veicular

App mobile para inspetores realizarem vistorias veiculares em campo, com preenchimento de formulários, captura de fotos e geração de relatórios.

## Tecnologias

- React Native + Expo
- TypeScript
- React Navigation
- Expo Camera / Image Picker

## Estrutura do Projeto

```
src/
├── screens/        # Telas do aplicativo
├── components/     # Componentes reutilizáveis
├── navigation/     # Configuração de rotas
├── services/       # Chamadas à API
├── types/          # Tipos TypeScript
└── utils/          # Funções auxiliares
```

## Como rodar

```bash
npm install
npx expo start
```

## Funcionalidades planejadas

- [ ] Login do inspetor
- [ ] Lista de vistorias pendentes
- [ ] Formulário de vistoria (dados do veículo, checklist, observações)
- [ ] Captura e anexo de fotos
- [ ] Assinatura digital
- [ ] Envio do relatório
