// Gerador de QR Code simples usando API pública
export const generateQRCode = async (text) => {
  try {
    // Usando API do QR Code Server (gratuita)
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(text)}`)
    
    if (!response.ok) {
      throw new Error('Erro ao gerar QR Code')
    }
    
    return response.url
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    // Retorna URL placeholder em caso de erro
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAgMTBIMjBWMTBIMTBWMTBaTTMwIDEwSDQwVjEwSDMwVjEwWk01MCAxMEg2MFYxMEg1MFYxMFpNNzAgMTBIODBWMTBINzBWMTBaTTkwIDEwSDEwMFYxMEg5MFYxMFpNMTEwIDEwSDEyMFYxMEgxMTBWMTBaTTEzMCAxMEgxNDBWMTBIMTMwVjEwWk0xNTAgMTBIMTYwVjEwSDE1MFYxMFpNMTAgMzBIMjBWMTBIMTBWMTBaTTMwIDMwSDQwVjEwSDMwVjEwWk01MCAzM0g2MFYxMEg1MFYxMFpNNzAgMzBIODBWMTBINzBWMTBaTTkwIDMwSDEwMFYxMEg5MFYxMFpNMTEwIDMwSDEyMFYxMEgxMTBWMTBaTTEzMCAzM0gxNDBWMTBIMTMwVjEwWk0xNTAgMzBIMTYwVjEwSDE1MFYxMFpNMTAgNTBIMjBWMTBIMTBWMTBaTTMwIDUwSDQwVjEwSDMwVjEwWk01MCA1MEg2MFYxMEg1MFYxMFpNNzAgNTBIODBWMTBINzBWMTBaTTkwIDUwSDEwMFYxMEg5MFYxMFpNMTEwIDUwSDEyMFYxMEgxMTBWMTBaTTEzMCA1MEgxNDBWMTBIMTMwVjEwWk0xNTAgNTBIMTYwVjEwSDE1MFYxMFpNMTAgNzBIMjBWMTBIMTBWMTBaTTMwIDcwSDQwVjEwSDMwVjEwWk01MCA3MEg2MFYxMEg1MFYxMFpNNzAgNzBIODBWMTBINzBWMTBaTTkwIDcwSDEwMFYxMEg5MFYxMFpNMTEwIDcwSDEyMFYxMEgxMTBWMTBaTTEzMCA3MEgxNDBWMTBIMTMwVjEwWk0xNTAgNzBIMTYwVjEwSDE1MFYxMFpNMTAgOTBIMjBWMTBIMTBWMTBaTTMwIDkwSDQwVjEwSDMwVjEwWk01MCA5MEg2MFYxMEg1MFYxMFpNNzAgOTBIODBWMTBINzBWMTBaTTkwIDkwSDEwMFYxMEg5MFYxMFpNMTEwIDkwSDEyMFYxMEgxMTBWMTBaTTEzMCA5MEgxNDBWMTBIMTMwVjEwWk0xNTAgOTBIMTYwVjEwSDE1MFYxMFpNMTAgMTEwSDIwVjEwSDEwVjEwWk0zMCAxMTBINFYxMEgzMFYxMFpNNTAgMTEwSDYwVjEwSDUwVjEwWk03MCAxMTBIODBWMTBINzBWMTBaTTkwIDExMEgxMDBWMTBIMTBWMTBaTTEyMCAxMTBIMTMwVjEwSDEyMFYxMFpNMTQwIDExMEgxNTBWMTBIMTQwVjEwWk0xMCAxMzBIMjBWMTBIMTBWMTBaTTMwIDEzMEg0MFYxMEgzMFYxMFpNNTAgMTMwSDYwVjEwSDUwVjEwWk03MCAxMzBIODBWMTBINzBWMTBaTTkwIDEzM0gxMDBWMTBIMTBWMTBaTTEyMCAxMzBIMTMwVjEwSDEyMFYxMFpNMTQwIDEzM0gxNTBWMTBIMTQwVjEwWk0xMCAxNTBIMjBWMTBIMTBWMTBaTTMwIDE1MEg0MFYxMEgzMFYxMFpNNTAgMTUwSDYwVjEwSDUwVjEwWk03MCAxNTBIODBWMTBINzBWMTBaTTkwIDE1MEgxMDBWMTBIMTBWMTBaTTEyMCAxNTBIMTMwVjEwSDEyMFYxMFpNMTQwIDE1MEgxNTBWMTBIMTQwVjEwWk0xMCAxNzBIMjBWMTBIMTBWMTBaTTMwIDE3MEg0MFYxMEgzMFYxMFpNNTAgMTcwSDYwVjEwSDUwVjEwWk03MCAxNzBIODBWMTBINzBWMTBaTTkwIDE3MEgxMDBWMTBIMTBWMTBaTTEyMCAxNzBIMTMwVjEwSDEyMFYxMFpNMTQwIDE3MEgxNTBWMTBIMTQwVjEwWiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+'
  }
}

// Função para copiar texto para área de transferência
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
