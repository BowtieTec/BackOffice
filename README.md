<div id="top"></div>

<!-- PROJECT SHIELDS -->
<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/BowtieTec/UGI_App1">
    <img src="src/assets/img/logo.png" alt="Logo" >
  </a>

<h3 align="center">ebiGo Management Software</h3>

  <p align="center">
    Web administration and management system for ebiGo application.
    <br>
    <a href="https://github.com/BowtieTec/UGI_App1"><strong>Explore the docs »</strong></a>
    <br>
    <br>
    <a href="https://dev.bowtietech.pro/ebiGo/#/">View Demo</a>
    ·
    <a href="https://github.com/BowtieTec/UGI_App1/issues">Report Bug</a>
    ·
    <a href="https://github.com/BowtieTec/UGI_App1/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://dev.bowtietech.pro/ebiGo/#/)

This frontend project allows you to administer and manage the users from application ebiGo, discounts, monthly parking,
see the money inflows and outflows, see reports about all that.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Angular](https://angular.io/)
* [Bootstrap](https://getbootstrap.com)
* [Typescript](https://www.typescriptlang.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

To build and run this project you need:

* [NodeJS LTS](https://nodejs.org/en/download/)
* npm
  ```sh
  npm install npm@latest -g
  ```
* Angular
  ```sh
  npm install -g @angular/cli
  ```
* Angular
  ```sh
  npm install typescript   
  ```

### Installation

1. Get an API Key from your coworkers.
2. Clone the repo
   ```sh
   git clone https://github.com/BowtieTec/UGI_App1.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter the data in environments files: `src/environments/`
   ```js
   const Ip = 'BACKEND URL'; //For example `dev.domain.pro`
   const Port = 'PORT'; // For example 3000
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- How Use -->

## How use

### Test into development environment

To launch the project with the parameters pointed to the backend on the development server, you can use:

   ```shell
   ng serve
   ```

### localhost environment

To launch the project with the parameters pointed to the backend on the localhost, you can use:

   ```shell
   ng server -c local
   ```

### Production environment

To launch the project with the parameters pointed to the backend on production, you can use:

   ```shell
   ng server -c production
   ```

### Build

To build this project you can use this command in the terminal:

   ```shell
   ng build
   ```

### Build on development configuration

To build this project with parameters pointed to the backend in dev, and configuration on dev, you can use this command
in the terminal:


   ```shell
   npm run devbuild
   ```

is the same as:

   ```shell
   ng build --configuration=development
   ```

<!-- ROADMAP -->

## Roadmap

- [x] Dashboard
- [x] Management
  - [x] Users (List, create, edit, delete)
  - [x] Roles (List permissions by role, assign permission to role by module)
- [x] Courtesies (List, create, download QR of courtesies)
- [x] Parking
  - [x] Create Parking (Six steps to create a parking lot)
  - [x] List users into parking lot, get out users from parking lot, search and others.
  - [x] Monthly parking (List, create, assign, delete, monthly parks to users)
    - [x] Create access profile
  - [x] Antennas (Create, edit, delete, assign and Download QR)


- See the [open issues](https://github.com/BowtieTec/UGI_App1/issues) for a full list of proposed features (and known
  issues).

<p align="right">(<a href="#top">back to top</a>)</p>
<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

This project is owned by Bowtie Tech. © 2022 Bowtie tech. All Rights Reserved.
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- Ing. Alejandro Cordova
  - [LinkedIn](https://www.linkedin.com/in/acordovam/)
  - [GitHub Profile](https://github.com/Acordovam)
  - [Gmail](mailto:alejandrocordova198@gmail.com) - alejandrocordova198@gmail.com

Project Link: [https://github.com/BowtieTec/UGI_App1](https://github.com/BowtieTec/UGI_App1)

<p align="right">(<a href="#top">back to top</a>)</p>


[contributors-shield]: https://img.shields.io/github/contributors/BowtieTec/UGI_App1.svg?style=for-the-badge

[contributors-url]: https://github.com/BowtieTec/UGI_App1/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/BowtieTec/UGI_App1.svg?style=for-the-badge

[forks-url]: https://github.com/BowtieTec/UGI_App1/network/members

[stars-shield]: https://img.shields.io/github/stars/BowtieTec/UGI_App1.svg?style=for-the-badge

[stars-url]: https://github.com/BowtieTec/UGI_App1/stargazers

[issues-shield]: https://img.shields.io/github/issues/BowtieTec/UGI_App1.svg?style=for-the-badge

[issues-url]: https://github.com/BowtieTec/UGI_App1/issues

[license-shield]: https://img.shields.io/github/license/BowtieTec/UGI_App1.svg?style=for-the-badge

[license-url]: https://github.com/BowtieTec/UGI_App1/blob/master/LICENSE.txt

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/acordovam/

[product-screenshot]: src/assets/img/screenshoot1.png
