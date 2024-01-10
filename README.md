# async-http-processing
Проект "async-http-processing" представляет собой разработку механизма асинхронной обработки HTTP запросов с использованием NodeJS и RabbitMQ.

Ссылка на видео-презентацию: 

## Инструкцию по локальному развертыванию проекта
1. Установите Node.js, npm и RabbitMQ
1. Установите зависимости для каждого микросервиса:
   ```
   cd M1
   npm install
   cd ../M2
   npm install
   ```
2. Запустите RabbitMQ
3. Запустите каждый микросервис
   ```
   cd M1
   node ./index.js
   cd ../M2
   node ./index.js
   ```

## Инструкция по использованию
1. Отправьте HTTP POST запрос на ```http://localhost:3000/send``` с числовым параметром в теле запроса. Пример: ```{
    "message": <числовой параметр>
}```
2. Микросервис M1 обработает HTTP запрос, преобразует его в задание и поместит в RabbitMQ.
3. Микросервис M2 получит задание из RabbitMQ, имитирует задержку в 5 секунд, удвоит переданный параметр и результат поместит обратно в RabbitMQ.
4. HTTP запрос получит ответ с удвоенным значением переданного параметра. Пример ответа:  ```{
    "data": {
        "message": <числовой параметр * 2>
    }
}```
