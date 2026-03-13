import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  await prisma.tripLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.place.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  const u1 = await prisma.user.create({
    data: {
      id: "u1",
      name: "Анастасия",
      email: "anastasia@example.com",
      password: "password123",
      avatarColor: "#2563eb",
      homeCity: "Москва",
    },
  });

  const u2 = await prisma.user.create({
    data: {
      id: "u2",
      name: "Иван",
      email: "ivan@example.com",
      password: "password123",
      avatarColor: "#0ea5e9",
      homeCity: "Санкт‑Петербург",
    },
  });

  const u3 = await prisma.user.create({
    data: {
      id: "u3",
      name: "Мария",
      email: "maria@example.com",
      password: "password123",
      avatarColor: "#6366f1",
      homeCity: "Казань",
    },
  });

  await prisma.trip.create({
    data: {
      id: "t1",
      userId: "u1",
      title: "Весенний Стамбул",
      city: "Стамбул",
      country: "Турция",
      startDate: "2025-04-10",
      endDate: "2025-04-16",
      days: 7,
      approximateCost: 88000,
      currency: "₽",
      rating: 5,
      coverImage:
        "https://media.istockphoto.com/id/1327842864/ru/фото/голубая-мечеть-стамбула-знаменитое-место-посещения-турция.jpg?s=1024x1024&w=is&k=20&c=U7E2joF7VGV_YDYba0iKhEDS4tPUv18HYz3X7NJkxZU=",
      notes:
        "Идеальная весенняя поездка: тепло, но не жарко, мало туристов и потрясающие виды на Босфор.",
      createdAt: "2025-04-20T10:00:00.000Z",
      places: {
        create: [
          {
            id: "p1",
            name: "Голубая мечеть",
            city: "Стамбул",
            note: "Лучше приходить к открытию, пока мало людей.",
            type: "attraction",
          },
          {
            id: "p2",
            name: "Галатская башня",
            city: "Стамбул",
            note: "Закат на смотровой площадке — must have.",
            type: "attraction",
          },
          {
            id: "c1",
            name: "Cafe Privato",
            city: "Стамбул",
            note: "Вкусные завтраки с видом на Галатский мост.",
            type: "cafe",
          },
        ],
      },
      comments: {
        create: {
          id: "cm1",
          authorId: "u2",
          message: "Очень хочу в Стамбул весной, спасибо за советы по кафе!",
          createdAt: "2025-04-21T09:15:00.000Z",
        },
      },
      likes: {
        create: [{ userId: "u2" }, { userId: "u3" }],
      },
    },
  });

  await prisma.trip.create({
    data: {
      id: "t2",
      userId: "u2",
      title: "Зимний Хельсинки",
      city: "Хельсинки",
      country: "Финляндия",
      startDate: "2025-01-05",
      endDate: "2025-01-09",
      days: 5,
      approximateCost: 120000,
      currency: "₽",
      rating: 4,
      coverImage:
        "https://media.istockphoto.com/id/183996236/ru/фото/хельсинки-финляндия.jpg?s=1024x1024&w=is&k=20&c=m7T7qvJlEYA03Hi_GmwPuomQw4OEFz0C03uw0ukzo1I=",
      notes:
        "Атмосферный северный город, много снега и уютных кафе. Немного дороговато, но того стоит.",
      createdAt: "2025-01-15T12:00:00.000Z",
      places: {
        create: [
          {
            id: "p3",
            name: "Суоменлинна",
            city: "Хельсинки",
            note: "Прогулка по крепости и море льда вокруг.",
            type: "attraction",
          },
          {
            id: "c2",
            name: "Cafe Regatta",
            city: "Хельсинки",
            note: "Очень атмосферное место на берегу залива.",
            type: "cafe",
          },
        ],
      },
      likes: {
        create: [{ userId: "u1" }],
      },
    },
  });

  await prisma.trip.create({
    data: {
      id: "t3",
      userId: "u3",
      title: "Уикенд в Баку",
      city: "Баку",
      country: "Азербайджан",
      startDate: "2025-05-01",
      endDate: "2025-05-04",
      days: 4,
      approximateCost: 65000,
      currency: "₽",
      rating: 5,
      coverImage:
        "https://media.istockphoto.com/id/690203164/ru/фото/огненные-башни-в-баку.jpg?s=1024x1024&w=is&k=20&c=JPKZsgo2bktddc9QyrpO70G3hcLQq-t7cQv_9dYCH-0=",
      notes:
        "Очень тёплый приём, вкусная еда и красивый старый город. Хочется вернуться ещё.",
      createdAt: "2025-05-06T18:30:00.000Z",
      places: {
        create: [
          {
            id: "p4",
            name: "Старый город Ичеришехер",
            city: "Баку",
            note: "Лучше гулять без карты и просто теряться в улочках.",
            type: "attraction",
          },
          {
            id: "c3",
            name: "Чайхана в старом городе",
            city: "Баку",
            note: "Чай с пахлавой и видом на улицы.",
            type: "cafe",
          },
        ],
      },
      comments: {
        create: {
          id: "cm2",
          authorId: "u1",
          message: "Как насчёт следующей зимой вместе? Выглядит волшебно.",
          createdAt: "2025-01-16T14:45:00.000Z",
        },
      },
      likes: {
        create: [{ userId: "u1" }, { userId: "u2" }],
      },
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
