require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const covid_api = require("covid19-api");
// const Markup = require("telegraf/markup");
const ALL_COUNTRIES = require("./all-countries");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Привет, ${ctx.message.from.first_name}! Получи информацию о зараженных короноварусом по всему миру 🦠. 
Отправь мне название страны на латинице, о которой ты хочешь получить информацию 📄📊. 
Список стран ты можешь узнать введя команду /help`,
    Markup.keyboard([["/help", "/start"]])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(ALL_COUNTRIES));
bot.on("text", async (ctx) => {
  try {
    let data = {};
    data = await covid_api.getReportsByCountries(ctx.message.text);
    let activeCasesMessage;
    if (data[0][0].active_cases.length == 0) {
      activeCasesMessage = "информация отсутствует 🤷‍♂️";
    } else {
      activeCasesMessage =
        data[0][0].active_cases[0].currently_infected_patients;
    }
    let messageData = `Всего зарегистрированных случаев в ${ctx.message.text} : ${data[0][0].cases}
Активных случаев: ${activeCasesMessage}
Смертей: ${data[0][0].deaths}
Вылечились ${data[0][0].recovered}
    `;
    ctx.reply(messageData);
  } catch {
    ctx.reply("Такой страны нет в списке, либо название написано не правельно");
  }
});
bot.launch();
console.log("Бот запущен");
