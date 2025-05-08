# DAG Explorer Project (v2)

DAG Explorer is an open-source tool designed for the Constellation Network to monitor transaction statuses and other important network information. This project is built with TypeScript, SST, and Next.js. You can find the live project at [dagexplorer.io](https://dagexplorer.io/).

## Features

- Monitor transaction statuses
- View network snapshots
- Access wallet addresses
- Supports MainNet, TestNet, and IntegrationNet networks
- Built with TypeScript, SST, and Next.js for a robust and scalable application (deployed in AWS)

## Installation

To get a local copy up and running, follow these simple steps:

1. **Clone the repository**

```sh
git clone https://github.com/StardustCollective/dag-explorer-v2
```

2. **Navigate to the project directory**

```sh
cd dag-explorer-v2
```

2. **Install dependencies**

```sh
pnpm install
```

## Dependencies
This repository relies on several private APIs to function effectively. Below are the details of these dependencies and their respective uses:

+ Firebase DAG Explorer Specialized Private API: This API is crucial for collecting data on MainNet 1.0, which is now deprecated. It provides detailed information about snapshots and transactions on this older network version.

+ Constellation Ecosystem Private API: This API is utilized to fetch information regarding token prices. It acts as a relay, connecting to the CoinGecko API to ensure accurate and up-to-date pricing data.

+ DAG Explorer Specialized Private API: This API is essential for obtaining comprehensive data about snapshots, transactions, metagraphs, rewards, node validators, and their rewards. It aggregates and processes information from the Constellation Block Explorer API, providing a optimized view of the network's activity.

These dependencies are integral to the functionality of the DAG Explorer, ensuring it can provide detailed and accurate network information.

## Usage

To start the development server, run:

```sh
pnpm dev
```

This will run the app in the development mode.
Open http://localhost:1014 to view it in the browser.

To build the app for production, run:

```sh
pnpm build
```

This will create a build directory with the production build of the app.

## Contributing

Stardust Collective welcomes developers interested in contributing to our open-source projects. We follow the GitFlow methodology, and we encourage you to start by creating a GitHub issue detailing your proposed feature or contribution. After an initial discussion, you can begin working on your own branch and later submit a Pull Request to the repository.

## License

This project is licensed under the [MIT License](./LICENSE)
