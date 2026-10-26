import type { Team } from "../types/Team";

export const teams: Team[] = [
  {
    id: "avengers",
    name: "Avengers",
    description:
      "Un equipo de héroes que se une para proteger al mundo de amenazas extraordinarias.",
    members: [
      "Iron Man",
      "Captain America",
      "Thor",
      "Hulk",
      "Black Widow",
      "Hawkeye",
    ],
    image: "",
  },
  {
    id: "x-men",
    name: "X-Men",
    description:
      "Mutantes que luchan por proteger a la humanidad y construir un futuro de convivencia.",
    members: [
      "Professor X",
      "Wolverine",
      "Cyclops",
      "Storm",
      "Jean Grey",
      "Beast",
      "Rogue",
    ],
    image: "",
  },
  {
    id: "fantastic-four",
    name: "Fantastic Four",
    description:
      "Una familia de exploradores con habilidades extraordinarias que enfrenta desafíos científicos y cósmicos.",
    members: [
      "Mister Fantastic",
      "Invisible Woman",
      "Human Torch",
      "The Thing",
    ],
    image: "",
  },
];
