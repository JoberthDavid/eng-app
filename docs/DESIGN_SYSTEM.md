# Design System --- Eng-App

**Versão:** 1.0\
**Status:** padrão de referência para novos componentes\
**Aplicação:** frontend Angular do Eng-App\
**Objetivo:** manter consistência visual, reduzir duplicação de SCSS e
orientar a criação e a manutenção de componentes.

------------------------------------------------------------------------

## 1. Regra principal para desenvolvimento

Antes de criar ou alterar estilos de um componente:

1.  Consulte este documento.
2.  Inspecione os tokens e estilos compartilhados existentes em
    `src/styles/`.
3.  Reutilize classes, variáveis CSS e padrões já existentes sempre que
    forem adequados.
4.  Mantenha no SCSS do componente somente o que for específico daquela
    página ou componente.
5.  Não introduza uma nova cor, espaçamento, raio, sombra ou regra de
    botão/tabela/formulário sem verificar primeiro se já existe um token
    ou padrão equivalente.
6.  Preserve o comportamento funcional e a lógica de negócio. Uma
    refatoração visual não deve alterar cálculos, chamadas HTTP, rotas,
    validações ou regras de domínio.

Este arquivo é a referência do projeto. Se o código existente divergir
deste documento, não presuma automaticamente que o código está correto:
identifique a divergência e proponha a menor correção segura.

## 2. Direção visual

O Eng-App utiliza uma linguagem visual profissional para um sistema de
engenharia, orçamento e planejamento de obras rodoviárias.

-   **Conceito:** *Engineering Slate* --- azul técnico, verde-azulado e
    neutros frios.
-   **Referência de produto:** combinação de clareza operacional de
    sistemas empresariais como SAP e TOTVS, sem copiar literalmente suas
    interfaces.
-   **Densidade:** equilibrada, adequada a telas de trabalho com tabelas
    e formulários.
-   **Altura de referência das linhas:** aproximadamente `36px`,
    respeitando exceções justificadas por conteúdo, acessibilidade ou
    uso móvel.
-   **Tipografia:** Inter.
-   **Bordas:** discretas e funcionais.
-   **Sombras:** reservadas principalmente a elementos flutuantes, como
    menus e popovers; evitar sombras decorativas generalizadas.
-   **Temas:** claro, escuro e sistema.
-   **Estrutura de navegação:** módulos e páginas operacionais são a
    estrutura dominante.
-   **Responsividade:** a interface deve continuar utilizável em telas
    menores, sem esconder ações essenciais.

## 3. Arquivos centrais do Design System

A fundação visual global está organizada em:

``` text
src/
├── styles.scss
└── styles/
    ├── _tokens.scss
    ├── _buttons.scss
    ├── _forms.scss
    └── _tables.scss
```

### Responsabilidade de cada arquivo

  -----------------------------------------------------------------------
  Arquivo                             Responsabilidade
  ----------------------------------- -----------------------------------
  `src/styles.scss`                   Importação dos módulos globais e
                                      estilos de fundação/reset que
                                      precisam atuar globalmente.

  `src/styles/_tokens.scss`           Tokens de cores, tipografia,
                                      espaçamento, raios, temas e aliases
                                      compartilhados.

  `src/styles/_buttons.scss`          Padrões compartilhados de botões e
                                      ações.

  `src/styles/_forms.scss`            Padrões compartilhados para campos
                                      e controles de formulário.

  `src/styles/_tables.scss`           Padrões comuns de tabelas,
                                      cabeçalhos, células, contornos e
                                      contêineres de rolagem.
  -----------------------------------------------------------------------

A inclusão dos módulos é feita com Sass `@use`, seguindo o padrão já
presente em `src/styles.scss`. Antes de adicionar outro módulo,
verifique se o conteúdo realmente representa uma responsabilidade global
reutilizável.

## 4. Tokens e valores visuais

-   Prefira os tokens CSS definidos em `_tokens.scss` em vez de repetir
    valores literais.
-   Use as variáveis existentes para cores, espaçamentos, raios,
    tipografia e temas.
-   Não crie aliases redundantes para o mesmo valor.
-   Não espalhe cores literais por SCSS de componentes.
-   Se faltar um token necessário, verifique se o conceito é
    reutilizável. Se for, proponha a inclusão centralizada no arquivo de
    tokens; se for estritamente específico, documente por que o valor
    local é necessário.
-   Evite `!important`. Use-o somente quando houver uma razão técnica
    clara e documentada.
-   Não use sombras, gradientes ou animações apenas como decoração.
-   Preserve os tokens e as regras existentes de foco visível, movimento
    reduzido e acessibilidade.

**Importante:** consulte os nomes e valores efetivamente definidos no
repositório antes de usar um token. Este documento define a política de
uso, não substitui o código-fonte dos tokens.

## 5. Temas claro, escuro e sistema

O seletor de aparência oferece três modos:

-   **Sistema:** acompanha `prefers-color-scheme` do sistema operacional
    e deve reagir a mudanças da preferência do sistema.
-   **Claro:** força o tema claro, independentemente da preferência do
    sistema.
-   **Escuro:** força o tema escuro, independentemente da preferência do
    sistema.

A preferência é persistida em `localStorage` com a chave
`eng-app-theme`, utilizando os valores `system`, `light` e `dark`.

Ao criar um componente:

1.  Prefira tokens semânticos que mudam conforme o tema.
2.  Não assuma que o fundo será sempre branco ou que o texto será sempre
    preto.
3.  Verifique contraste de texto, bordas, estados desabilitados, foco,
    hover, seleção e mensagens.
4.  Evite duplicar a lógica de seleção de tema dentro de componentes de
    página.
5.  Não altere a lógica global do tema sem avaliar o menu, a
    persistência e os três modos.

## 6. Botões e ações

Antes de criar uma classe nova, consulte `src/styles/_buttons.scss`.

Use os padrões compartilhados adequados, incluindo as classes existentes
como:

-   `.primary-action`
-   `.secondary-action`
-   `.primary-button`
-   `.secondary-button`
-   `.ghost-button`

Escolha a variante pelo significado da ação, não apenas pela cor:

-   **Primária:** ação principal da tela ou do fluxo.
-   **Secundária:** ação alternativa importante.
-   **Ghost:** ação auxiliar que precisa de menor destaque.

Regras:

-   Não redefina globalmente estilos que já pertencem ao módulo
    compartilhado.
-   Não crie uma nova variante apenas para alterar pequenos detalhes
    locais; prefira uma classe específica de componente quando a
    diferença for realmente necessária.
-   Mantenha estados de `hover`, `focus-visible`, `disabled` e, quando
    aplicável, carregamento.
-   Botões de ícone devem ter nome acessível, por exemplo com
    `aria-label`, quando não houver texto visível.
-   Não use elementos `<div>` ou `<span>` como botões interativos quando
    um `<button>` for apropriado.

## 7. Formulários e campos

Consulte `src/styles/_forms.scss` antes de estilizar inputs, selects,
textareas ou outros controles.

-   Reutilize o padrão compartilhado de campos.
-   Mantenha rótulos claros e associados aos respectivos controles.
-   Preserve mensagens de erro, ajuda, estados desabilitados e foco
    visível.
-   Não remova o indicador de foco sem fornecer uma alternativa
    perceptível.
-   Não force a mesma altura em todos os campos se o contexto exigir uma
    exceção. Documente exceções locais, como campos compactos de tabelas
    ou filtros densos.
-   Evite regras amplas que afetem controles de outras páginas sem
    necessidade.
-   Confira se as regras globais não estão sobrescrevendo dimensões
    específicas do componente.

## 8. Tabelas, listas e dados de engenharia

Consulte `src/styles/_tables.scss` antes de definir regras para tabelas.

O sistema possui telas com dados técnicos, hierarquias, valores
monetários, composições e planejamento. A apresentação deve priorizar
leitura, comparação e precisão.

-   Reutilize os padrões compartilhados de cabeçalho, células, bordas e
    contêineres de rolagem.
-   Mantenha alinhamento consistente: textos normalmente à esquerda;
    quantidades e valores numéricos podem ser alinhados à direita
    conforme o contexto.
-   Use formatação coerente para moeda, unidades, percentuais e
    quantidades.
-   Preserve hierarquias visuais de grupos, itens e subtotais sem
    depender apenas de cor.
-   Cabeçalhos e ações importantes devem permanecer compreensíveis em
    telas menores.
-   Use `position: sticky` somente quando necessário e teste a
    sobreposição, o fundo e o comportamento durante a rolagem.
-   Regras específicas como colunas fixas, larguras, indentação
    hierárquica, linhas de total e tabelas de impressão devem permanecer
    no SCSS da página quando não forem genéricas.
-   Não altere a semântica HTML da tabela apenas para facilitar a
    estilização.

## 9. Organização do SCSS de componentes

O SCSS de cada componente deve conter somente o que é específico dele.

**Pode permanecer no componente:**

-   layout exclusivo da página;
-   dimensões ou alinhamentos próprios;
-   estados visuais específicos daquela funcionalidade;
-   colunas fixas, hierarquia e regras especiais de tabela;
-   regras responsivas necessárias à composição local;
-   estilos específicos de impressão;
-   exceções locais justificadas.

**Deve ser avaliado para centralização:**

-   botões repetidos em diversas páginas;
-   campos de formulário com as mesmas regras;
-   cabeçalhos, células e contêineres de tabela repetidos;
-   cores, espaçamentos, raios e sombras literais recorrentes;
-   regras idênticas de foco, hover e desabilitado.

Não centralize uma regra apenas porque aparece em mais de um arquivo.
Confirme que a semântica e o comportamento são realmente iguais. Uma
semelhança visual não significa necessariamente que os componentes devam
compartilhar exatamente o mesmo seletor.

Evite seletores excessivamente genéricos, como `button`, `input`,
`table` ou `section`, quando puderem interferir em funcionalidades
distintas. Regras globais devem ser intencionais e estar nos módulos
globais apropriados.

## 10. Acessibilidade e interação

Todo componente novo deve considerar:

-   foco visível por teclado;
-   ordem de navegação lógica;
-   contraste suficiente nos dois temas;
-   rótulos e nomes acessíveis para controles;
-   estados de erro que não dependam exclusivamente de cor;
-   respeito a `prefers-reduced-motion`;
-   áreas clicáveis adequadas;
-   uso sem mouse nas interações principais;
-   semântica HTML apropriada.

Menus, diálogos, popovers e outros elementos flutuantes devem ter
comportamento de abertura e fechamento consistente, incluindo teclado e
interação externa quando aplicável.

## 11. Responsividade

-   Evite larguras rígidas sem necessidade.
-   Preserve a legibilidade dos dados e o acesso às ações.
-   Para tabelas extensas, prefira uma estratégia explícita de rolagem
    horizontal a comprimir todas as colunas indiscriminadamente.
-   Teste menus, painéis laterais, formulários e tabelas em larguras
    menores.
-   Não resolva problemas de layout escondendo ações importantes sem
    alternativa.
-   Mantenha o padrão visual consistente entre páginas, mesmo quando a
    estrutura responsiva precisar variar.

## 12. Procedimento para criar um novo componente

Siga esta sequência:

1.  **Inspecionar:** leia este documento, os tokens e os módulos
    compartilhados relevantes.
2.  **Entender a página:** identifique hierarquia, ações primárias,
    filtros, formulários, tabelas e estados.
3.  **Reutilizar:** aplique os padrões compartilhados existentes antes
    de criar classes novas.
4.  **Implementar localmente:** escreva no SCSS do componente apenas as
    regras exclusivas.
5.  **Verificar temas:** teste claro, escuro e sistema.
6.  **Verificar interação:** teste foco, hover, disabled, teclado, menus
    e rolagem.
7.  **Verificar responsividade:** teste a tela ampla e uma largura
    menor.
8.  **Verificar regressões:** confirme que as mudanças não alteraram a
    lógica nem os estilos de outras páginas.
9.  **Executar verificações:** rode o build e os testes pertinentes
    disponíveis no projeto.
10. **Revisar duplicações:** procure literais, seletores e declarações
    repetidas introduzidos pela alteração.
11. **Relatar:** liste arquivos alterados, padrões compartilhados
    usados, exceções locais e verificações executadas.

## 13. Checklist de revisão

Antes de considerar um componente concluído, confirme:

-   [ ] Consultei este documento e os estilos compartilhados.
-   [ ] Reutilizei tokens em vez de repetir valores visuais.
-   [ ] Não repliquei estilos de botões, formulários ou tabelas sem
    justificativa.
-   [ ] O componente funciona nos temas claro, escuro e sistema.
-   [ ] Há foco visível e controles com nomes acessíveis.
-   [ ] Os estados hover, disabled, erro e seleção são perceptíveis.
-   [ ] A interface funciona com teclado nas interações principais.
-   [ ] A página continua utilizável em telas menores.
-   [ ] Estilos específicos, como sticky e impressão, foram preservados
    quando necessários.
-   [ ] Não alterei lógica de negócio como parte de uma mudança
    puramente visual.
-   [ ] Executei o build e os testes pertinentes ou registrei claramente
    o que não foi possível executar.
-   [ ] Revisei o diff e procurei duplicações introduzidas.

## 14. Como atualizar este padrão

Se uma nova necessidade visual aparecer:

1.  Pesquise primeiro se já existe solução equivalente.
2.  Determine se a regra é global, compartilhada por uma categoria de
    componentes ou exclusiva de uma página.
3.  Para regras globais reutilizáveis, altere o módulo central adequado.
4.  Para exceções locais, mantenha a regra no componente e explique a
    necessidade.
5.  Atualize este documento quando a decisão mudar a convenção do
    projeto.
6.  Não aumente limites de orçamento do Angular apenas para esconder
    avisos de tamanho; avalie a causa e o impacto primeiro.

## 15. Instrução para assistentes de código

Ao implementar ou refatorar componentes no Eng-App:

> Siga `docs/DESIGN_SYSTEM.md` como referência visual do projeto. Antes
> de escrever SCSS, inspecione `src/styles.scss` e os módulos
> `src/styles/_tokens.scss`, `_buttons.scss`, `_forms.scss` e
> `_tables.scss` que forem relevantes. Reutilize tokens e padrões
> compartilhados; mantenha no componente somente estilos específicos.
> Preserve a lógica funcional. Verifique temas claro, escuro e sistema,
> acessibilidade, responsividade e regressões. Não invente nomes de
> tokens ou classes: confirme que existem no código. Informe exceções e
> verificações realizadas.

------------------------------------------------------------------------

**Nota de manutenção:** este documento descreve as decisões de design e
a organização conhecida do projeto. O código atual dos tokens, classes e
componentes é a fonte de verdade para nomes e valores exatos. Atualize
este documento quando o Design System evoluir.
