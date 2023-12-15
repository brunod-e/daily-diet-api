<br/>
<p align="center">
  <a href="https://github.com/brunod-e/daily-diet-api">
    <img src="https://cdn3.iconfinder.com/data/icons/diet-fitness-4/512/nuts-food-healthy-diet-512.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Daily Diet API</h3>

  <p align="center">
    Rest API for a daily diet application
    <br/>
    <br/>
    <a href="https://github.com/brunod-e/daily-diet-api/issues">Report Bug</a>
    .
    <a href="https://github.com/brunod-e/daily-diet-api/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/brunod-e/daily-diet-api?color=dark-green) ![Issues](https://img.shields.io/github/issues/brunod-e/daily-diet-api) ![License](https://img.shields.io/github/license/brunod-e/daily-diet-api) 

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

![Screen Shot](https://i.ibb.co/4p92nsK/imagem-2023-12-15-084911588.png)

This project is the backend API for a daily diet application, providing functionality related to user authentication, data storage, and retrieval for managing daily dietary information.


## Built With

This API is built with Fastify and TypeScript, utilizing various libraries for testing, database management, and environment variable handling. It's designed to support a daily diet application, providing a reliable and performant backend for managing user data related to dietary habits.Here are a few examples.

## Getting Started

This project is available at: https://daily-diet-api-r1k9.onrender.com/

### Prerequisites

* npm

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo

```sh
git clone https://github.com/brunod-e/daily-diet-api
```

2. Install NPM packages

```sh
npm install
```

3. Configure your .env

```JS
DATABASE_URL="./db/app.db"
DATABASE_CLIENT="sqlite"
NODE_ENV="development"
```

4. Run migrations

```sh
npm run dev-knex -- migrate:latest
```

5. Run server

```sh
npm run dev
```

6. Run tests

```sh
npm test
```

## Usage

```POST /users```

Descrição: Rota para criar um usuário.
Parâmetros:
name(string): Nome do usuário.
email (string): Email do usuário.

```GET /meals```

Descrição: Obter todas as refeições registradas.

```POST /meals```

Descrição: Adicionar uma nova refeição ao usuário.
Parâmetros:
name (string): Nome da refeição.
description (string): Descrição da refeição.
isOnDiet (boolean): Se está ou não incluso na dieta.
date (string): Data que foi feita a refeição.

```GET /meals/:id```

Descrição: Obter uma refeição específica.
Parâmetros:
id (string): Identificador único da refeição.

```PUT /meals/:id```

Descrição: Atualiza uma refeição.
Parâmetros:
id (string): Identificador único da refeição.
name (string): Nome da refeição.
description (string): Descrição da refeição.
isOnDiet (boolean): Se está ou não incluso na dieta.
date (string): Data que foi feita a refeição.

```DELETE /meals/:id```

Descrição: Apaga uma refeição.
Parâmetros:
id (string): Identificador único da refeição.

```GET /meals/metrics```

Descrição: Retorna os dados relacionados a todas as refeições feitas pelo usuário.


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/brunod-e/daily-diet-api/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/brunod-e/daily-diet-api/blob/main/LICENSE.md) for more information.

## Authors

* **Bruno D.** - *Fullstack Developer* - [Bruno D.](https://github.com/brunod-e) - *Built full application*

## Acknowledgements

* [Rocketseat](https://github.com/rocketseat-education)
