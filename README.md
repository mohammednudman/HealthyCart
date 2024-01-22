# Healthy Cart

Write a brief introduction about your project here.

## Table of Contents
* [Introduction](#introduction)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)

## Introduction

Healthy Cart is an eCommerce application designed to provide a healthier choice for online shoppers. The app connects with numerous online supermarkets and provides a rating on the healthiness of the user's shopping cart.

The application is comprised of:

* **Frontend:** The frontend is a React.js application that provides an intuitive and responsive interface for users to interact with.

* **Backend:** Our backend, built using Node.js, handles all the business logic, including API handling, user authentication, and decision computations.

* **Flask Back end:** Flask backend is responsible for doing the healthiness computation using various AI and ML algorithms. It communicates with the main backend for data exchange.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project locally, you need to have the following software installed:

- Docker
- Docker Compose

### Installation

1. Clone this repository:

    ```shell
    git clone https://github.com/mohammednudman/HealthyCart.git
    ```

2. Navigate to the project directory:

    ```shell
    cd HealthyCart
    ```

3. Use Docker Compose to build and start the services:

    ```shell
    docker-compose up -d --build
    ```

The application should now be running at localhost:3000.

