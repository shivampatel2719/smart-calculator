# SmartLead Calculator 

## Overview (URL : https://jocular-dasik-10ed97.netlify.app/)

**SmartLead Calculator** is a web-based calculator application designed with a modern, cyberpunk-inspired user interface. In addition to performing standard arithmetic operations, the application includes an **audit trail** feature that records all calculations performed during a session. The tool also offers basic **chat interaction**, enhancing user engagement beyond traditional calculators.

---

## Features

- **Interactive Calculator Interface**: Supports both keyboard and mouse inputs for performing calculations.
- **Audit Trail**: Maintains a log of all calculations, which can be reviewed during the session.
- **Chat Functionality**: Provides a basic conversational interface for user interaction.
- **Modern UI**: Includes dynamic visual effects to enhance the user experience.

---

## Prerequisites

To run the project locally, ensure the following dependencies are installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- npm (Node package manager, typically included with Node.js)

---

## Installation Instructions

### Clone the repository:

```bash
git clone https://github.com/yourusername/smartlead-calculator.git
cd smartlead-calculator
```

### Install dependencies:

```bash
npm install
```

# Usage Guide

## Calculator Controls

Use on-screen buttons or your keyboard to enter numbers and operations.

Press the Enter key to evaluate expressions.

Press the C key to clear all input.

Use Backspace to delete the last character entered.

## Audit Trail

Click the clipboard icon in the interface to view a chronological list of all calculations performed in the current session.

# Technical Architecture

The application is built using the following technologies:

- React.js – Frontend framework for building the user interface.
- AWS Lambda – Serverless function used to record and retrieve calculation history.
- DynamoDB – Database used to store the calculation history.
- CSS – Custom styling for the cyberpunk aesthetic.

