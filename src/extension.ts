import * as vscode from "vscode";

// API'ye istek atacak fonksiyon
async function queryOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tinyllama", // Model ismini buraya yazdınız
        prompt: prompt,
        max_tokens: 50,
      }),
    });

    // API isteği başarısızsa hata mesajı döndür
    if (!response.ok) {
      console.error("API request failed:", response.statusText);
      return "Error: API request failed";
    }

    // JSON verisini parse et
	console.log('response', response)
    const data = await response.json();
	console.log('data', data)
	return JSON.stringify(data)

  } catch (error) {
    console.error("Error querying Ollama:", error);
    return "An error occurred while fetching data.";
  }
}

// Uzantı aktif olduğunda çalışacak fonksiyon
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.queryOllama", // Komut adı
    async () => {
      // Kullanıcıdan prompt girmesini iste
      const prompt = await vscode.window.showInputBox({
        placeHolder: "Ollama modeline soracağınız soruyu yazın",
        prompt: "Ollama modeline soru yazın",
      });

      if (prompt) {
        try {
          // Model isteğini gönder ve sonucu al
          const result = await queryOllama(prompt);
          console.log("Result from Ollama:", result);
          
          // Sonucu kullanıcıya göster
          vscode.window.showInformationMessage(result);
        } catch (error) {
          console.error("Error querying Ollama:", error);
          vscode.window.showErrorMessage("Bir hata oluştu");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// Uzantı devre dışı kaldığında yapılacak işlemler
export function deactivate() {}
