export const formatAIResponse = (text: string): string => {
  // Удаляем системные инструкции, если они есть
  const userStart = text.indexOf('user\n');
  const modelStart = text.indexOf('model\n');
  
  if (userStart !== -1 && modelStart !== -1) {
    text = text.substring(modelStart + 6);
  }

  // Заменяем markdown-подобные символы на HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Убираем жирный текст
    .replace(/\n\n/g, '\n') // Убираем двойные переносы
    .trim();
}; 