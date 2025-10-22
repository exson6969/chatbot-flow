# Chatbot Flow Builder

A dynamic and extensible chatbot flow builder created for the frontend assessment. Built with Next.js, TypeScript, and React Flow.


### Core Features

-   **Drag-and-Drop Nodes**: A "Message" node can be dragged from the Nodes Panel onto the canvas.
-   **Extensible Nodes Panel**: The panel is built in a data-driven way, making it easy to add new node types in the future.
-   **Edges & Handles**: Nodes can be connected via edges, respecting all handle validation rules.
-   **Source Handle Validation**: A source handle can only have **one** outgoing edge.
-   **Target Handle Validation**: A target handle can have **multiple** incoming edges.
-   **Dynamic Settings Panel**: When a node is selected, a settings panel appears, allowing the user to update its content.
-   **Save Flow with Validation**: A "Save" button checks for validation rules (ensuring there are not multiple nodes with empty target handles) before logging the flow state.

### Enhanced Features

-   **AI-Powered Flow Generation**: Integrated the **Google Gemini API** via **LangChain** to allow users to generate a complete chatbot flow from a simple text prompt.
-   **Secure API Handling**: All communication with the AI model is proxied through a Next.js API route, ensuring the API key is never exposed to the client-side.
-   **Notifications**: Implemented `react-hot-toast` to provide non-intrusive feedback for successes, warnings, and errors.

## Technologies Used

-   **Framework**: Next.js
-   **Language**: TypeScript
-   **Flow Builder**: React Flow
-   **Styling**: Tailwind CSS
-   **AI Integration**: LangChain.js with Google Gemini
-   **Icons**: Lucide React
-   **Notifications**: React Hot Toast

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/exson6969/chatbot-flow
    cd chatbot-flow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Google Gemini API key:
    ```
    GOOGLE_API_KEY="your_gemini_api_key_here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.