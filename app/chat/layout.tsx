import { ChatProvider } from "../context/chatStates";

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (

        <section>
          <ChatProvider> 
            {children}
          </ChatProvider>
        </section>

    );
  }