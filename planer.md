# Relatório de Progresso: Viva Home Backend

Aqui está um status detalhado do nosso projeto, comparando o plano original com o que foi implementado.

## 1. O que já foi feito (CONCLUÍDO)

Nós finalizamos toda a fundação e o sistema de autenticação, que são os pilares de qualquer aplicação.

### ✅ Fase 0: A Fundação
* **Inicialização do Projeto:** Concluída.
* **Dependências-Chave:** Todas as dependências de `config`, `passport`, `jwt`, `prisma`, `bcrypt`, `class-validator`, `google-oauth20`, `axios` e `schedule` foram instaladas.
* **`ConfigModule`:** Concluído e configurado como global.
* **`PrismaModule`:** Concluído, com `PrismaService` global.
* **`Pipes Globais`:** O `ValidationPipe` global está configurado no `main.ts`.

### ✅ Fase 1: Módulo de Usuário (`UserModule`)
* **`UserService`:** Todo o CRUD (`create`, `findByEmail`, `findById`, `update`, `delete`) está 100% implementado e funcional.
* **Refatoração:** `updateRefreshToken` foi (corretamente) removido e substituído por um `SessionModule` dedicado.
* **`UserController`:** Todas as rotas (`/users/me`) estão criadas.
* **DTOs:** `CreateUser.dto.ts` e `UpdateUser.dto.ts` estão criados e validados (inclusive atualizados para suportar o login Google).
* **Segurança:** O `UserController` está 100% protegido pelo `JwtAuthGuard`.

### ✅ Fase 2: Módulo de Localização (`LocationModule`)
* **Decisão de Arquitetura:** Concluída. Escolhemos a **Opção A (API Externa)** para maior simplicidade e agilidade.
* **`LocationService`:** Implementado usando o `@nestjs/axios` para consultar a API do IBGE em tempo real.
* **`LocationController`:** Rotas `GET /locations/states` e `GET /locations/states/:uf/cities` estão funcionais.

### ✅ Fase 3: Módulo de Autenticação (`AuthModule`)
* **Configuração:** Módulo configurado e importando `UserModule`, `JwtModule`, `PassportModule`, `ConfigModule` e o novo `SessionModule`.
* **`AuthService`:**
    * `register`, `validateUser`: Concluídos.
    * `login`: Concluído e refatorado para criar um registro na tabela `Session`.
    * `googleLogin`: Concluído (implementado como `validateGoogleUser` e `loginFromGoogle`).
    * `refreshTokens`: Concluído, com Rotação de Tokens e correção de hash (usando `sha256` ao invés de `bcrypt`).
* **`AuthController`:**
    * `POST /auth/register`: Concluído.
    * `POST /auth/login`: Concluído.
    * `GET /auth/google`: Concluído.
    * `GET /auth/google/callback`: Concluído.
    * `POST /auth/refresh`: Concluído.
    * *(Novo)* `POST /auth/logout`: Concluído.
* **Strategies & Guards:** `JwtStrategy`, `GoogleStrategy` e `JwtAuthGuard` estão implementados e funcionando.
* *(Novo)* **Decorator `@User`:** Criado para facilitar o acesso ao usuário logado nos controllers.

### ✅ Fase 7: Módulo de Saúde (`HealthModule`)
* **`AppController`:** As rotas `GET /ping` e `GET /health/db` foram implementadas com sucesso no controller principal.

### ⭐ Novas Features Implementadas (Não estavam no plano original)

* ✅ **`SessionModule` (Arquitetura Profissional):** Refatoramos a lógica de refresh token para usar uma tabela `Session` dedicada, permitindo **múltiplos logins por usuário** (desktop, celular) e salvando o `deviceAgent`.
* ✅ **`TasksModule` (Cron Job):** Criamos um módulo de tarefas agendadas (`@nestjs/schedule`) que roda `deleteExpiredSessions` automaticamente todo dia, mantendo o banco de dados limpo e performático.

---

## 2. O que ainda falta (PENDENTE)

Com a base pronta, agora vamos focar no "core business" da aplicação (Anúncios) e em funcionalidades de suporte (E-mail).

### ❌ Fase 0: Definição do Schema (Complemento)
* `Model PasswordResetToken`: Precisará ser criado na Fase 4.
* `Model Announcement`: Precisará ser criado na Fase 5.
* `Model Image`: Precisará ser criado na Fase 6.

### ❌ Fase 4: Módulo de E-mail e Senha (`MailModule` & `PasswordModule`)
* **`MailModule`:** Criar o `MailService` (usando `Nodemailer`) para enviar e-mails transacionais.
* **`AuthModule (Expansão)`:**
    * Implementar a lógica `forgotPassword` no `AuthService` (gerar token, salvar no `PasswordResetToken`, enviar e-mail).
    * Implementar a lógica `resetPassword` no `AuthService` (validar token, atualizar senha, deletar token).
* **`AuthController (Expansão)`:**
    * Criar a rota `POST /auth/forgot-password`.
    * Criar a rota `POST /auth/reset-password`.

### ❌ Fase 5: Módulo de Anúncios (`AnnouncementModule`)
* **`AnnouncementService`:** Criar toda a lógica de negócio (CRUD).
    * `create` (associado ao `userId`).
    * `findAll` (com **filtros** e **paginação**).
    * `findOne`.
    * `update` (com verificação de dono).
    * `delete` (com verificação de dono).
* **`AnnouncementController`:** Criar as rotas (públicas e protegidas).
* **DTOs:** Criar os DTOs `CreateAnnouncement.dto.ts`, `UpdateAnnouncement.dto.ts` e `QueryAnnouncement.dto.ts`.
* **Guards:** Criar um `IsOwnerGuard` customizado para as rotas de `update` e `delete`.

### ❌ Fase 6: Módulo de Upload (Imagens dos Anúncios)
* **Decisão de Arquitetura:** Precisamos decidir entre Storage Local (simples) ou Cloud (ex: S3, Cloudinary - mais profissional).
* **`UploadService`:** Criar um serviço para lidar com o upload dos arquivos.
* **Expansão:** Adicionar rotas no `AnnouncementController` (ex: `POST /announcements/:id/images`) usando `FileInterceptor` para receber as imagens.