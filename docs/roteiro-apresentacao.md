# Roteiro de apresentacao do projeto

## Atividade

Video de apresentacao do projeto desenvolvido na disciplina de Programacao Web II.

Tempo recomendado: entre 10 e 12 minutos.

Tempo maximo permitido: 15 minutos.

## Parte 1: Apresentacao geral e demonstracao do sistema

Tempo sugerido: 0:00 ate 7:00.

Ola, professor. Neste video vou apresentar o projeto desenvolvido na disciplina de Programacao Web II.

O sistema apresentado e o UpClass, uma aplicacao administrativa para gerenciamento de cursos, categorias e usuarios. Ele foi desenvolvido com o objetivo de organizar essas informacoes em um ambiente web, permitindo que o administrador consiga cadastrar, listar, editar, visualizar e excluir registros de forma simples.

O problema que o sistema resolve e a falta de centralizacao dessas informacoes. Com ele, os dados ficam organizados em telas proprias e protegidos por login.

A primeira funcionalidade e a autenticacao. O usuario acessa a tela de login, informa e-mail e senha, e somente apos a validacao consegue entrar no sistema. Caso tente acessar uma pagina interna sem estar logado, o sistema redireciona para o login. Isso garante um controle basico de acesso as telas administrativas.

Tambem foi criada uma tela de cadastro de usuario. Nessa tela foram adicionadas validacoes importantes, como nome obrigatorio, e-mail em formato valido, senha com tamanho minimo, confirmacao de senha, mascara automatica para CPF e validacao real do CPF informado. Alem disso, o sistema tambem impede o cadastro de e-mail ou CPF duplicado, exibindo uma mensagem para o usuario corrigir os dados.

Outro ponto implementado foi o controle por perfil. O cadastro feito pela tela inicial cria um usuario com perfil de aluno, entao esse usuario consegue entrar no sistema, mas nao recebe permissoes administrativas. O perfil de instrutor fica limitado a area de cursos, e o administrador mantem acesso completo as areas de categorias, cursos e usuarios.

Agora vou demonstrar o funcionamento do sistema.

Aqui temos a tela de login. Vou informar os dados de acesso e entrar no sistema. Apos o login, sou direcionado para a tela inicial administrativa, onde aparece o menu lateral com as opcoes principais.

Na area de categorias, e possivel cadastrar uma nova categoria, visualizar a listagem, editar os dados, consultar os detalhes e remover um registro. Tambem foi implementado um tratamento para evitar erro quando a categoria possui cursos vinculados. Nesse caso, o sistema bloqueia a exclusao e mostra uma mensagem informando que primeiro e necessario editar ou remover os cursos relacionados.

Na area de cursos, a logica e parecida. O sistema permite cadastrar cursos, listar os cursos ja salvos, editar informacoes, consultar detalhes e excluir quando necessario. No cadastro do curso, tambem existe relacionamento com a categoria, o que mostra a integracao entre as tabelas do banco de dados.

Na area de usuarios, temos o gerenciamento dos usuarios cadastrados. O formulario possui campos como nome, e-mail, CPF, senha, perfil e status. Se algum dado estiver incorreto, como e-mail invalido, CPF invalido, senha curta ou confirmacao diferente, o sistema apresenta erro e impede o cadastro. Se o e-mail ou CPF ja estiver cadastrado, o sistema tambem informa o problema antes de salvar.

Com isso, o sistema ja apresenta as principais operacoes de uma aplicacao web administrativa: login, controle de acesso por perfil, cadastro, listagem, visualizacao, edicao, exclusao, validacoes de formulario, relacionamento entre entidades e tratamento de erro quando uma exclusao nao pode ser realizada.

## Parte 2: Estrutura do projeto, tecnologias, codigo e encerramento

Tempo sugerido: 7:00 ate 12:30.

Agora vou apresentar a estrutura do projeto no editor de codigo, explicando como as pastas foram organizadas, quais tecnologias foram utilizadas e onde ficam as principais regras de negocio do sistema.

### Estrutura inicial do projeto

Mostrar: `src/main.ts`, linhas 11 a 42.

O arquivo `main.ts` e responsavel por iniciar a aplicacao. Nesse trecho sao configuradas as validacoes globais, os arquivos estaticos, o middleware de autenticacao, o uso das views com EJS, o layout principal e a porta em que o servidor sera executado.

Mostrar: `src/app.module.ts`, linhas 11 a 23.

O arquivo `app.module.ts` funciona como modulo principal da aplicacao. Ele reune os modulos do sistema, como autenticacao, categorias, cursos, usuarios e banco de dados. Essa divisao segue a organizacao do NestJS e ajuda a manter cada parte com sua responsabilidade.

Mostrar: `src/config/database/database.providers.ts`, linhas 10 a 36.

Nesse trecho fica a configuracao do banco de dados. O projeto utiliza MySQL com TypeORM, e os dados de conexao sao lidos por variaveis de ambiente. As entidades do projeto sao carregadas para que o TypeORM consiga mapear as classes para tabelas no banco.

### Tecnologias e recursos utilizados

As principais tecnologias utilizadas foram Node.js com NestJS no back-end, EJS para renderizacao das paginas, TypeORM como ORM, MySQL como banco de dados, class-validator e class-transformer para validacoes, cookies com token assinado para autenticacao e arquivos estaticos na pasta `public` para CSS, JavaScript, icones e recursos visuais.

### Autenticacao e controle de acesso

Mostrar: `src/modules/autenticacao/autenticacao.service.ts`, linhas 18 a 83.

Esse service concentra a logica de login e cadastro. Primeiro o sistema tenta validar um usuario cadastrado no banco. Se o usuario existir e a senha estiver correta, os dados dele sao retornados para gerar o token. Tambem existe um usuario padrao configurado por variaveis de ambiente. No cadastro publico, o sistema cria o usuario com perfil de aluno, evitando que um cadastro comum receba permissao administrativa.

Mostrar: `src/modules/autenticacao/autenticacao.middleware.ts`, linhas 12 a 84.

Esse e um dos trechos principais do projeto. O middleware verifica se a rota acessada exige permissao, le o token do cookie, identifica o usuario autenticado e valida o perfil. Administradores acessam categorias, cursos e usuarios. Instrutores acessam cursos. Alunos nao acessam as areas administrativas. Se o usuario nao estiver logado, ele e redirecionado para o login. Se estiver logado, mas sem permissao, o sistema mostra a tela de acesso restrito.

Mostrar: `views/inicial.ejs`, linhas 1 a 186.

Na tela inicial, a interface tambem respeita o perfil do usuario. Se o usuario for aluno, ele nao ve o painel administrativo. Se for instrutor ou administrador, os cards e botoes aparecem de acordo com as permissoes liberadas.

### Validacoes de usuarios, senha e CPF

Mostrar: `src/modules/usuario/usuario.service.ts`, linhas 41 a 158.

Nesse trecho esta a logica principal de usuarios. A senha nao e salva diretamente no banco. O sistema gera um salt e um hash usando `scryptSync`. No login, ele compara a senha informada com o hash salvo. Tambem existe a validacao para impedir e-mail ou CPF duplicado antes de criar ou atualizar um usuario.

Mostrar: `src/modules/usuario/usuario.utils.ts`, linhas 7 a 34.

Aqui esta a validacao real do CPF. O sistema remove a mascara, verifica se existem 11 digitos, recusa CPFs repetidos e calcula os digitos verificadores. Isso impede que o usuario cadastre um CPF invalido.

Mostrar: `src/modules/usuario/dtos/create-usuario.dto.ts`, linhas 34 a 81.

Esse DTO mostra as validacoes do formulario de usuario. Ele valida nome, e-mail, CPF, senha, confirmacao de senha, perfil e status. Assim, os dados passam por uma validacao antes de chegar ao service e ao banco de dados.

Mostrar: `src/modules/autenticacao/dtos/cadastro.dto.ts`, linhas 16 a 52.

Esse DTO e usado no cadastro publico. Ele valida os dados principais do usuario, incluindo e-mail, CPF, senha e confirmacao. Esse ponto e importante porque mostra que o cadastro tambem segue as regras de validacao do sistema.

### Categorias, cursos e relacionamento entre entidades

Mostrar: `src/modules/curso/curso.entity.ts`, linhas 13 a 45.

Essa entidade representa a tabela de cursos. Ela define campos como titulo, descricao, preco, status e instrutor. Tambem mostra o relacionamento com categoria usando `ManyToOne`, indicando que cada curso pertence a uma categoria.

Mostrar: `src/modules/curso/curso.service.ts`, linhas 8 a 74.

Nesse service fica a logica de cursos. Ele lista cursos, busca por termo, cria, atualiza e remove registros. A busca usa QueryBuilder e filtra por titulo, descricao, status e nome da categoria, fazendo o campo de busca funcionar de verdade.

Mostrar: `src/modules/categoria/categoria.service.ts`, linhas 16 a 72.

Nesse service fica a logica de categorias. Alem das operacoes de cadastro, listagem, edicao e exclusao, existe uma regra de protecao: antes de excluir uma categoria, o sistema verifica se ela possui cursos vinculados. Se possuir, a exclusao e bloqueada para preservar a integridade dos dados.

Mostrar: `src/modules/categoria/categoria.controller.ts`, linhas 102 a 148.

No controller, essa regra aparece no fluxo da tela. Se a categoria tiver cursos vinculados, o sistema renderiza a tela de exclusao com uma mensagem de bloqueio. Se nao houver vinculo, a exclusao acontece normalmente e o usuario volta para a listagem.

### Explicacao dos resultados

Durante a demonstracao, e importante explicar que os dados informados nos formularios passam primeiro pelos DTOs de validacao. Depois seguem para os services, onde ficam as regras de negocio. Por fim, as entities representam como esses dados serao armazenados no banco de dados pelo TypeORM.

Tambem e importante destacar que o sistema nao apenas salva os dados, mas trata alguns resultados esperados: quando o login falha, exibe mensagem de credenciais invalidas; quando o CPF ou e-mail ja existe, bloqueia o cadastro; quando a categoria tem curso vinculado, bloqueia a exclusao; e quando o perfil nao tem permissao, mostra acesso restrito.

### Encerramento

Para finalizar, este projeto permitiu praticar os principais conceitos da disciplina de Programacao Web II, como rotas, controllers, services, DTOs, entities, views, formularios, validacoes, autenticacao, controle de acesso, relacionamento entre tabelas e persistencia com banco de dados.

As principais dificuldades foram integrar autenticacao, validacoes, perfis de acesso e regras de banco de dados, porque essas partes precisam funcionar em conjunto. Como melhorias futuras, o sistema poderia receber recuperacao de senha, relatorios administrativos, filtros mais avancados e uma area propria para o aluno acompanhar cursos.

Esse foi o projeto desenvolvido. Obrigado.

## Divisao entre participantes

Se houver mais de um desenvolvedor na apresentacao, uma divisao simples pode ser:

- Pessoa 1: apresentacao geral e objetivo do sistema.
- Pessoa 2: demonstracao das telas e funcionalidades.
- Pessoa 3: estrutura do codigo, tecnologias e encerramento.
