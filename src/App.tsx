import { FormEvent, useEffect, useMemo, useState } from "react";

type Question = {
  id: number;
  difficulty: string;
  text: string;
  options: string[];
  answer: string;
};

type Rank = {
  title: string;
  message: string;
};

type AttemptRecord = {
  date: string;
  attempts: number;
  usedQuestionIds: number[];
};

type Screen = "intro" | "quiz" | "retry" | "result";

const questionBank: Question[] = [
  {
    id: 1,
    difficulty: "Level 1",
    text: "What is Naruto Uzumaki's dream?",
    options: ["Become Hokage", "Become Jonin", "Become ANBU", "Become Kazekage"],
    answer: "Become Hokage",
  },
  {
    id: 2,
    difficulty: "Level 2",
    text: "Who is Luffy searching for?",
    options: ["Dragon Balls", "One Piece", "Death Note", "Titan Serum"],
    answer: "One Piece",
  },
  {
    id: 3,
    difficulty: "Level 3",
    text: "What is the name of Tanjiro's sister?",
    options: ["Shinobu", "Mitsuri", "Nezuko", "Kanao"],
    answer: "Nezuko",
  },
  {
    id: 4,
    difficulty: "Level 4",
    text: "In Attack on Titan, what are giant humanoids called?",
    options: ["Hollows", "Titans", "Curses", "Demons"],
    answer: "Titans",
  },
  {
    id: 5,
    difficulty: "Level 5",
    text: "What sport is featured in Haikyuu!!?",
    options: ["Basketball", "Soccer", "Volleyball", "Baseball"],
    answer: "Volleyball",
  },
  {
    id: 6,
    difficulty: "Level 6",
    text: "Who possesses the Death Note first in the series?",
    options: ["Light Yagami", "L", "Ryuk", "Misa"],
    answer: "Light Yagami",
  },
  {
    id: 7,
    difficulty: "Level 7",
    text: "What is Goku's Saiyan name?",
    options: ["Vegeta", "Bardock", "Kakarot", "Raditz"],
    answer: "Kakarot",
  },
  {
    id: 8,
    difficulty: "Level 8",
    text: "What is the name of Ash Ketchum's first Pokemon?",
    options: ["Bulbasaur", "Pikachu", "Charmander", "Squirtle"],
    answer: "Pikachu",
  },
  {
    id: 9,
    difficulty: "Level 9",
    text: "Which anime features Edward Elric?",
    options: ["Bleach", "Fullmetal Alchemist", "Fairy Tail", "Black Clover"],
    answer: "Fullmetal Alchemist",
  },
  {
    id: 10,
    difficulty: "Level 10",
    text: "What color is Ichigo Kurosaki's hair?",
    options: ["Black", "Brown", "Orange", "Blue"],
    answer: "Orange",
  },
  {
    id: 11,
    difficulty: "Level 11",
    text: "Who is Naruto's father?",
    options: ["Jiraiya", "Minato", "Kakashi", "Itachi"],
    answer: "Minato",
  },
  {
    id: 12,
    difficulty: "Level 12",
    text: "What is the name of Monkey D. Luffy's brother?",
    options: ["Ace", "Law", "Shanks", "Kid"],
    answer: "Ace",
  },
  {
    id: 13,
    difficulty: "Level 13",
    text: "Which organization does Gojo belong to?",
    options: ["Demon Slayer Corps", "Soul Society", "Jujutsu High", "Survey Corps"],
    answer: "Jujutsu High",
  },
  {
    id: 14,
    difficulty: "Level 14",
    text: "What is Levi Ackerman famous for?",
    options: ["Cooking", "Titan Slaying", "Alchemy", "Basketball"],
    answer: "Titan Slaying",
  },
  {
    id: 15,
    difficulty: "Level 15",
    text: "What is Deku's real name?",
    options: ["Katsuki", "Shoto", "Izuku Midoriya", "Tenya"],
    answer: "Izuku Midoriya",
  },
  {
    id: 16,
    difficulty: "Level 16",
    text: "Who teaches Class 1-A?",
    options: ["Endeavor", "Aizawa", "All Might", "Hawks"],
    answer: "Aizawa",
  },
  {
    id: 17,
    difficulty: "Level 17",
    text: "What is the name of Gon Freecss's best friend?",
    options: ["Kurapika", "Leorio", "Killua", "Hisoka"],
    answer: "Killua",
  },
  {
    id: 18,
    difficulty: "Level 18",
    text: "In Demon Slayer, what breathing style does Zenitsu use?",
    options: ["Water", "Thunder", "Flame", "Wind"],
    answer: "Thunder",
  },
  {
    id: 19,
    difficulty: "Level 19",
    text: "What is the name of the giant wall protecting humanity in AOT?",
    options: ["Wall Maria", "Wall Rose", "Wall Sina", "All of these"],
    answer: "All of these",
  },
  {
    id: 20,
    difficulty: "Level 20",
    text: "Which anime is about pirates?",
    options: ["Naruto", "One Piece", "Bleach", "Dr. Stone"],
    answer: "One Piece",
  },
  {
    id: 21,
    difficulty: "Level 21",
    text: "Who is known as the strongest sorcerer in JJK?",
    options: ["Sukuna", "Geto", "Gojo", "Nanami"],
    answer: "Gojo",
  },
  {
    id: 22,
    difficulty: "Level 22",
    text: "What is the name of Eren's hometown?",
    options: ["Shiganshina", "Trost", "Liberio", "Ragako"],
    answer: "Shiganshina",
  },
  {
    id: 23,
    difficulty: "Level 23",
    text: "What is Light Yagami's alias?",
    options: ["Joker", "Kira", "Zero", "Phantom"],
    answer: "Kira",
  },
  {
    id: 24,
    difficulty: "Level 24",
    text: "Which anime features the Survey Corps?",
    options: ["One Piece", "Naruto", "Attack on Titan", "Black Clover"],
    answer: "Attack on Titan",
  },
  {
    id: 25,
    difficulty: "Level 25",
    text: "What color is Nezuko's bamboo muzzle?",
    options: ["Green", "Black", "Brown", "Red"],
    answer: "Green",
  },
  {
    id: 26,
    difficulty: "Level 26",
    text: "Who trained Naruto during the timeskip?",
    options: ["Kakashi", "Jiraiya", "Tsunade", "Yamato"],
    answer: "Jiraiya",
  },
  {
    id: 27,
    difficulty: "Level 27",
    text: "What clan does Sasuke belong to?",
    options: ["Hyuga", "Senju", "Uchiha", "Uzumaki"],
    answer: "Uchiha",
  },
  {
    id: 28,
    difficulty: "Level 28",
    text: "What is Kakashi known as?",
    options: ["White Fang", "Copy Ninja", "Yellow Flash", "Toad Sage"],
    answer: "Copy Ninja",
  },
  {
    id: 29,
    difficulty: "Level 29",
    text: "Who became the Seventh Hokage?",
    options: ["Naruto", "Kakashi", "Sasuke", "Shikamaru"],
    answer: "Naruto",
  },
  {
    id: 30,
    difficulty: "Level 30",
    text: "What beast is sealed inside Naruto?",
    options: ["One-Tail", "Nine-Tails", "Eight-Tails", "Ten-Tails"],
    answer: "Nine-Tails",
  },
  {
    id: 31,
    difficulty: "Level 31",
    text: "What is the name of Luffy's ship after the Going Merry?",
    options: ["Red Force", "Thousand Sunny", "Oro Jackson", "Polar Tang"],
    answer: "Thousand Sunny",
  },
  {
    id: 32,
    difficulty: "Level 32",
    text: "Who gave Luffy his straw hat?",
    options: ["Ace", "Shanks", "Garp", "Roger"],
    answer: "Shanks",
  },
  {
    id: 33,
    difficulty: "Level 33",
    text: "What is Zoro's dream?",
    options: ["Become Pirate King", "Greatest Swordsman", "Find All Blue", "Become Admiral"],
    answer: "Greatest Swordsman",
  },
  {
    id: 34,
    difficulty: "Level 34",
    text: "Who is the navigator of the Straw Hats?",
    options: ["Robin", "Nami", "Vivi", "Hancock"],
    answer: "Nami",
  },
  {
    id: 35,
    difficulty: "Level 35",
    text: "What is Sanji's dream?",
    options: ["Become King", "Find All Blue", "Beat Zoro", "Discover One Piece"],
    answer: "Find All Blue",
  },
  {
    id: 36,
    difficulty: "Level 36",
    text: "What race is Goku?",
    options: ["Human", "Saiyan", "Namekian", "Android"],
    answer: "Saiyan",
  },
  {
    id: 37,
    difficulty: "Level 37",
    text: "Who is Vegeta's wife?",
    options: ["Bulma", "Chi-Chi", "Videl", "Android 18"],
    answer: "Bulma",
  },
  {
    id: 38,
    difficulty: "Level 38",
    text: "What color is Super Saiyan hair?",
    options: ["Blue", "Red", "Gold", "Silver"],
    answer: "Gold",
  },
  {
    id: 39,
    difficulty: "Level 39",
    text: "Who created the Dragon Balls on Earth?",
    options: ["Kami", "Vegeta", "Goku", "Beerus"],
    answer: "Kami",
  },
  {
    id: 40,
    difficulty: "Level 40",
    text: "What is Beerus the God of?",
    options: ["Creation", "Destruction", "Time", "Light"],
    answer: "Destruction",
  },
  {
    id: 41,
    difficulty: "Level 41",
    text: "What breathing style does Tanjiro mainly use?",
    options: ["Water", "Flame", "Wind", "Thunder"],
    answer: "Water",
  },
  {
    id: 42,
    difficulty: "Level 42",
    text: "Who is the Flame Hashira?",
    options: ["Rengoku", "Giyu", "Tengen", "Muichiro"],
    answer: "Rengoku",
  },
  {
    id: 43,
    difficulty: "Level 43",
    text: "What demon turned Nezuko into a demon?",
    options: ["Akaza", "Kokushibo", "Muzan", "Doma"],
    answer: "Muzan",
  },
  {
    id: 44,
    difficulty: "Level 44",
    text: "Who is the Sound Hashira?",
    options: ["Sanemi", "Obanai", "Tengen", "Gyomei"],
    answer: "Tengen",
  },
  {
    id: 45,
    difficulty: "Level 45",
    text: "What color is Tanjiro's sword initially?",
    options: ["Blue", "Green", "Black", "White"],
    answer: "Black",
  },
  {
    id: 46,
    difficulty: "Level 46",
    text: "Who inherited the Attack Titan before Eren?",
    options: ["Grisha", "Levi", "Erwin", "Zeke"],
    answer: "Grisha",
  },
  {
    id: 47,
    difficulty: "Level 47",
    text: "What branch was Erwin Smith captain of?",
    options: ["Garrison", "Military Police", "Survey Corps", "Navy"],
    answer: "Survey Corps",
  },
  {
    id: 48,
    difficulty: "Level 48",
    text: "Who is Mikasa's closest friend?",
    options: ["Armin", "Jean", "Connie", "Sasha"],
    answer: "Armin",
  },
  {
    id: 49,
    difficulty: "Level 49",
    text: "What city fell first in AOT?",
    options: ["Trost", "Shiganshina", "Liberio", "Ragako"],
    answer: "Shiganshina",
  },
  {
    id: 50,
    difficulty: "Level 50",
    text: "What is Levi's rank?",
    options: ["Commander", "Captain", "General", "Major"],
    answer: "Captain",
  },
  {
    id: 51,
    difficulty: "Level 51",
    text: "What school does Yuji Itadori attend?",
    options: ["Jujutsu High", "UA High", "Karasuno", "Teiko"],
    answer: "Jujutsu High",
  },
  {
    id: 52,
    difficulty: "Level 52",
    text: "Who is the King of Curses?",
    options: ["Mahito", "Sukuna", "Jogo", "Geto"],
    answer: "Sukuna",
  },
  {
    id: 53,
    difficulty: "Level 53",
    text: "What covers Gojo's eyes?",
    options: ["Mask", "Bandages", "Blindfold", "Helmet"],
    answer: "Blindfold",
  },
  {
    id: 54,
    difficulty: "Level 54",
    text: "Who is Yuji's classmate with a hammer technique?",
    options: ["Nobara", "Maki", "Mei Mei", "Utahime"],
    answer: "Nobara",
  },
  {
    id: 55,
    difficulty: "Level 55",
    text: "What is Megumi's surname?",
    options: ["Zenin", "Fushiguro", "Kugisaki", "Kamo"],
    answer: "Fushiguro",
  },
  {
    id: 56,
    difficulty: "Level 56",
    text: "Which team does Hinata play for?",
    options: ["Nekoma", "Karasuno", "Fukurodani", "Shiratorizawa"],
    answer: "Karasuno",
  },
  {
    id: 57,
    difficulty: "Level 57",
    text: "What position does Kageyama play?",
    options: ["Libero", "Setter", "Ace", "Wing Spiker"],
    answer: "Setter",
  },
  {
    id: 58,
    difficulty: "Level 58",
    text: "Who is known as the \"Little Giant\"?",
    options: ["Hinata", "Tanaka", "Former Karasuno Ace", "Tsukishima"],
    answer: "Former Karasuno Ace",
  },
  {
    id: 59,
    difficulty: "Level 59",
    text: "What color is Karasuno's jersey?",
    options: ["Red", "Orange", "Blue", "Green"],
    answer: "Orange",
  },
  {
    id: 60,
    difficulty: "Level 60",
    text: "What animal symbolizes Karasuno?",
    options: ["Eagle", "Crow", "Hawk", "Owl"],
    answer: "Crow",
  },
  {
    id: 61,
    difficulty: "Level 61",
    text: "What is Killua's family famous for?",
    options: ["Pirates", "Assassins", "Ninjas", "Hunters"],
    answer: "Assassins",
  },
  {
    id: 62,
    difficulty: "Level 62",
    text: "What card game is central to Greed Island?",
    options: ["Duel Monsters", "Greed Island Cards", "Vanguard", "Poker"],
    answer: "Greed Island Cards",
  },
  {
    id: 63,
    difficulty: "Level 63",
    text: "Who is Gon searching for?",
    options: ["Mother", "Father", "Brother", "Teacher"],
    answer: "Father",
  },
  {
    id: 64,
    difficulty: "Level 64",
    text: "What weapon does Kurapika use?",
    options: ["Sword", "Chains", "Bow", "Gun"],
    answer: "Chains",
  },
  {
    id: 65,
    difficulty: "Level 65",
    text: "What group killed Kurapika's clan?",
    options: ["Phantom Troupe", "Akatsuki", "Espada", "Marines"],
    answer: "Phantom Troupe",
  },
  {
    id: 66,
    difficulty: "Level 66",
    text: "What is L's favorite food?",
    options: ["Cake", "Ice Cream", "Candy", "Chips"],
    answer: "Cake",
  },
  {
    id: 67,
    difficulty: "Level 67",
    text: "What is Misa Amane's profession?",
    options: ["Detective", "Idol", "Doctor", "Student Council President"],
    answer: "Idol",
  },
  {
    id: 68,
    difficulty: "Level 68",
    text: "What notebook kills people?",
    options: ["Fate Book", "Death Note", "Doom Book", "Black Diary"],
    answer: "Death Note",
  },
  {
    id: 69,
    difficulty: "Level 69",
    text: "What is Ryuk?",
    options: ["Human", "God", "Shinigami", "Demon Lord"],
    answer: "Shinigami",
  },
  {
    id: 70,
    difficulty: "Level 70",
    text: "Who is Light's rival?",
    options: ["Near", "Mello", "L", "Ryuk"],
    answer: "L",
  },
  {
    id: 71,
    difficulty: "Level 71",
    text: "What is Saitama's hero name?",
    options: ["Bald Hero", "Caped Baldy", "One Punch King", "Hero Zero"],
    answer: "Caped Baldy",
  },
  {
    id: 72,
    difficulty: "Level 72",
    text: "Which anime features alchemy?",
    options: ["Bleach", "Naruto", "Fullmetal Alchemist", "Fairy Tail"],
    answer: "Fullmetal Alchemist",
  },
  {
    id: 73,
    difficulty: "Level 73",
    text: "What is Asta's dream in Black Clover?",
    options: ["Become Wizard King", "Become Hokage", "Become Pirate King", "Become Hero"],
    answer: "Become Wizard King",
  },
  {
    id: 74,
    difficulty: "Level 74",
    text: "Which anime features Rimuru Tempest?",
    options: ["Overlord", "Slime", "Fairy Tail", "Log Horizon"],
    answer: "Slime",
  },
  {
    id: 75,
    difficulty: "Level 75",
    text: "What sport is played in Blue Lock?",
    options: ["Basketball", "Baseball", "Football", "Volleyball"],
    answer: "Football",
  },
  {
    id: 76,
    difficulty: "Level 76",
    text: "Who is the captain of Squad 10 in Bleach?",
    options: ["Byakuya", "Hitsugaya", "Kenpachi", "Urahara"],
    answer: "Hitsugaya",
  },
  {
    id: 77,
    difficulty: "Level 77",
    text: "What is Ichigo's Zanpakuto called?",
    options: ["Senbonzakura", "Zangetsu", "Hyorinmaru", "Nozarashi"],
    answer: "Zangetsu",
  },
  {
    id: 78,
    difficulty: "Level 78",
    text: "Who is the Soul Reaper scientist?",
    options: ["Aizen", "Urahara", "Mayuri", "Renji"],
    answer: "Mayuri",
  },
  {
    id: 79,
    difficulty: "Level 79",
    text: "What is Byakuya's surname?",
    options: ["Kuchiki", "Abarai", "Shiba", "Hirako"],
    answer: "Kuchiki",
  },
  {
    id: 80,
    difficulty: "Level 80",
    text: "Who betrayed Soul Society?",
    options: ["Aizen", "Renji", "Toshiro", "Chad"],
    answer: "Aizen",
  },
  {
    id: 81,
    difficulty: "Level 81",
    text: "What guild does Natsu belong to?",
    options: ["Sabertooth", "Fairy Tail", "Lamia Scale", "Blue Pegasus"],
    answer: "Fairy Tail",
  },
  {
    id: 82,
    difficulty: "Level 82",
    text: "What type of magic does Natsu use?",
    options: ["Ice", "Fire Dragon Slayer", "Water", "Lightning"],
    answer: "Fire Dragon Slayer",
  },
  {
    id: 83,
    difficulty: "Level 83",
    text: "Who is Lucy's celestial spirit key partner?",
    options: ["Aquarius", "Virgo", "Leo", "Taurus"],
    answer: "Leo",
  },
  {
    id: 84,
    difficulty: "Level 84",
    text: "What is Happy?",
    options: ["Cat", "Dragon", "Human", "Exceed"],
    answer: "Exceed",
  },
  {
    id: 85,
    difficulty: "Level 85",
    text: "What color is Erza's hair?",
    options: ["Blue", "Blonde", "Red", "Black"],
    answer: "Red",
  },
  {
    id: 86,
    difficulty: "Level 86",
    text: "Who is known as the Symbol of Peace?",
    options: ["Endeavor", "Hawks", "All Might", "Best Jeanist"],
    answer: "All Might",
  },
  {
    id: 87,
    difficulty: "Level 87",
    text: "What is Bakugo's quirk?",
    options: ["Explosion", "Fire", "Wind", "Steel"],
    answer: "Explosion",
  },
  {
    id: 88,
    difficulty: "Level 88",
    text: "What is Todoroki's quirk?",
    options: ["Ice Only", "Fire Only", "Half Hot Half Cold", "Lightning"],
    answer: "Half Hot Half Cold",
  },
  {
    id: 89,
    difficulty: "Level 89",
    text: "Who inherited One For All after All Might?",
    options: ["Bakugo", "Deku", "Mirio", "Todoroki"],
    answer: "Deku",
  },
  {
    id: 90,
    difficulty: "Level 90",
    text: "What is All Might's real name?",
    options: ["Toshinori Yagi", "Enji Todoroki", "Shota Aizawa", "Tenko Shimura"],
    answer: "Toshinori Yagi",
  },
  {
    id: 91,
    difficulty: "Level 91",
    text: "Who is the Wizard King at the start of Black Clover?",
    options: ["Yami", "Julius", "Nozel", "Fuegoleon"],
    answer: "Julius",
  },
  {
    id: 92,
    difficulty: "Level 92",
    text: "What is Asta born without?",
    options: ["Magic", "Strength", "Intelligence", "Mana Zone"],
    answer: "Magic",
  },
  {
    id: 93,
    difficulty: "Level 93",
    text: "Which squad does Yami captain?",
    options: ["Black Bulls", "Golden Dawn", "Silver Eagles", "Crimson Lions"],
    answer: "Black Bulls",
  },
  {
    id: 94,
    difficulty: "Level 94",
    text: "What is Yuno's primary magic?",
    options: ["Fire", "Wind", "Water", "Earth"],
    answer: "Wind",
  },
  {
    id: 95,
    difficulty: "Level 95",
    text: "What is Asta's anti-magic weapon?",
    options: ["Axe", "Sword", "Spear", "Bow"],
    answer: "Sword",
  },
  {
    id: 96,
    difficulty: "Level 96",
    text: "What is Rimuru's original form?",
    options: ["Human", "Slime", "Demon", "Dragon"],
    answer: "Slime",
  },
  {
    id: 97,
    difficulty: "Level 97",
    text: "Who names Rimuru?",
    options: ["Veldora", "Milim", "Shion", "Benimaru"],
    answer: "Veldora",
  },
  {
    id: 98,
    difficulty: "Level 98",
    text: "What nation does Rimuru found?",
    options: ["Tempest", "Nazarick", "Eldia", "Clover"],
    answer: "Tempest",
  },
  {
    id: 99,
    difficulty: "Level 99",
    text: "Who is the Demon Lord friend of Rimuru?",
    options: ["Milim", "Aqua", "Eris", "Shalltear"],
    answer: "Milim",
  },
  {
    id: 100,
    difficulty: "Level 100",
    text: "What color is Rimuru often depicted as?",
    options: ["Green", "Blue", "Red", "Purple"],
    answer: "Blue",
  },
  {
    id: 101,
    difficulty: "Level 101",
    text: "Who is the ruler of Nazarick?",
    options: ["Ainz Ooal Gown", "Cocytus", "Demiurge", "Sebas"],
    answer: "Ainz Ooal Gown",
  },
  {
    id: 102,
    difficulty: "Level 102",
    text: "What race is Ainz?",
    options: ["Human", "Elf", "Undead", "Demon"],
    answer: "Undead",
  },
  {
    id: 103,
    difficulty: "Level 103",
    text: "What game was Ainz trapped from?",
    options: ["Yggdrasil", "Aincrad", "Tempest", "SAO"],
    answer: "Yggdrasil",
  },
  {
    id: 104,
    difficulty: "Level 104",
    text: "Who serves as Nazarick's guardian overseer?",
    options: ["Albedo", "Shalltear", "Aura", "Mare"],
    answer: "Albedo",
  },
  {
    id: 105,
    difficulty: "Level 105",
    text: "What is Albedo's role?",
    options: ["Guardian Overseer", "Mage", "Warrior", "Assassin"],
    answer: "Guardian Overseer",
  },
  {
    id: 106,
    difficulty: "Level 106",
    text: "What is Kirito known as?",
    options: ["Black Swordsman", "White Knight", "Sword Saint", "Dual Hero"],
    answer: "Black Swordsman",
  },
  {
    id: 107,
    difficulty: "Level 107",
    text: "What virtual world starts SAO?",
    options: ["Alfheim", "Yggdrasil", "Aincrad", "Gun Gale"],
    answer: "Aincrad",
  },
  {
    id: 108,
    difficulty: "Level 108",
    text: "Who is Kirito's main partner?",
    options: ["Sinon", "Asuna", "Alice", "Leafa"],
    answer: "Asuna",
  },
  {
    id: 109,
    difficulty: "Level 109",
    text: "What happens if players die in SAO?",
    options: ["Respawn", "Lose XP", "Die in real life", "Restart"],
    answer: "Die in real life",
  },
  {
    id: 110,
    difficulty: "Level 110",
    text: "What weapon style is Kirito famous for?",
    options: ["Spear", "Dual Wielding", "Bow", "Magic"],
    answer: "Dual Wielding",
  },
  {
    id: 111,
    difficulty: "Level 111",
    text: "What class is Frieren?",
    options: ["Warrior", "Mage", "Archer", "Priest"],
    answer: "Mage",
  },
  {
    id: 112,
    difficulty: "Level 112",
    text: "Who was Frieren's hero companion?",
    options: ["Stark", "Himmel", "Fern", "Eisen"],
    answer: "Himmel",
  },
  {
    id: 113,
    difficulty: "Level 113",
    text: "What race is Frieren?",
    options: ["Human", "Demon", "Elf", "Dwarf"],
    answer: "Elf",
  },
  {
    id: 114,
    difficulty: "Level 114",
    text: "Who is Frieren's apprentice?",
    options: ["Fern", "Aura", "Serie", "Flamme"],
    answer: "Fern",
  },
  {
    id: 115,
    difficulty: "Level 115",
    text: "What is Stark's role?",
    options: ["Warrior", "Mage", "Priest", "Archer"],
    answer: "Warrior",
  },
  {
    id: 116,
    difficulty: "Level 116",
    text: "What is Sung Jinwoo known as?",
    options: ["Shadow Monarch", "Demon King", "Hunter King", "Dragon Lord"],
    answer: "Shadow Monarch",
  },
  {
    id: 117,
    difficulty: "Level 117",
    text: "Which anime features Sung Jinwoo?",
    options: ["Tower of God", "Solo Leveling", "God of High School", "Noblesse"],
    answer: "Solo Leveling",
  },
  {
    id: 118,
    difficulty: "Level 118",
    text: "What rank hunter was Jinwoo initially?",
    options: ["S Rank", "B Rank", "E Rank", "A Rank"],
    answer: "E Rank",
  },
  {
    id: 119,
    difficulty: "Level 119",
    text: "What power does Jinwoo command?",
    options: ["Fire", "Ice", "Shadows", "Wind"],
    answer: "Shadows",
  },
  {
    id: 120,
    difficulty: "Level 120",
    text: "What is the name of Jinwoo's strongest shadow soldier?",
    options: ["Igris", "Beru", "Tank", "Iron"],
    answer: "Beru",
  },
  {
    id: 121,
    difficulty: "Level 121",
    text: "Which anime features Yoichi Isagi?",
    options: ["Haikyuu", "Blue Lock", "Ao Ashi", "Days"],
    answer: "Blue Lock",
  },
  {
    id: 122,
    difficulty: "Level 122",
    text: "What position does Isagi play?",
    options: ["Goalkeeper", "Defender", "Striker", "Midfielder"],
    answer: "Striker",
  },
  {
    id: 123,
    difficulty: "Level 123",
    text: "Who created Blue Lock?",
    options: ["Ego Jinpachi", "Noel Noa", "Anri", "Barou"],
    answer: "Ego Jinpachi",
  },
  {
    id: 124,
    difficulty: "Level 124",
    text: "What country does Blue Lock aim to improve?",
    options: ["Brazil", "Germany", "Japan", "Spain"],
    answer: "Japan",
  },
  {
    id: 125,
    difficulty: "Level 125",
    text: "What sport is featured in Blue Lock?",
    options: ["Rugby", "Football", "Basketball", "Baseball"],
    answer: "Football",
  },
];

const attemptStorageKey = "marshmallow-anime-quiz-attempts";
const maxAttemptsPerDay = 2;
const questionsPerQuiz = 10;
const certificateImageUrl = "/quiz-arena.png";
const logoImageUrl = "/marshmallow-logo-cropped.png";
const marshmallowWebsiteUrl = "https://marshmallow-tech.com/";
const discountText = "2% discount unlocked at Marshmallow Tech.";
const ranksByScore: Rank[] = [
  {
    title: "Academy Rookie",
    message: "Your training arc begins today. Marshmallow Tech invites you to try again and claim a guild post.",
  },
  {
    title: "Scout",
    message: "You are ready to step beyond the walls. Marshmallow Tech awards you the post of Scout.",
  },
  {
    title: "Soul Reaper",
    message: "Your spirit pressure is rising. Marshmallow Tech awards you the post of Soul Reaper.",
  },
  {
    title: "Hunter",
    message: "You passed the first true test of instinct. Marshmallow Tech awards you the post of Hunter.",
  },
  {
    title: "Pro Hero",
    message: "You showed courage under pressure. Marshmallow Tech awards you the post of Pro Hero.",
  },
  {
    title: "Hokage",
    message: "Your village would trust your judgment. Marshmallow Tech recognizes you as Hokage.",
  },
  {
    title: "Special Grade",
    message: "Your anime knowledge carries dangerous energy. Marshmallow Tech awards you Special Grade status.",
  },
  {
    title: "S-Class Hunter",
    message: "You are moving with elite instincts. Marshmallow Tech awards you the post of S-Class Hunter.",
  },
  {
    title: "Hashira",
    message: "You have serious anime breathing technique. Marshmallow Tech awards you the post of Hashira.",
  },
  {
    title: "Super Saiyan",
    message: "Your power level exceeded the scanner's limits. Few warriors reach this legendary form.",
  },
  {
    title: "Pirate King",
    message: "You cleared the trial perfectly. Marshmallow Tech announces that you are the Pirate King.",
  },
];

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function getAttemptRecord(): AttemptRecord {
  const fallback: AttemptRecord = { date: todayKey(), attempts: 0, usedQuestionIds: [] };

  try {
    const record = JSON.parse(localStorage.getItem(attemptStorageKey) || "null") as AttemptRecord | null;
    if (record?.date !== todayKey()) {
      return fallback;
    }

    return {
      date: record.date,
      attempts: record.attempts || 0,
      usedQuestionIds: Array.isArray(record.usedQuestionIds) ? record.usedQuestionIds : [],
    };
  } catch {
    return fallback;
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  localStorage.setItem(attemptStorageKey, JSON.stringify(record));
}

function getRank(score: number): Rank {
  return ranksByScore[Math.max(0, Math.min(score, questionsPerQuiz))];
}

function shuffleQuestions(items: Question[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuizQuestions(excludedQuestionIds: number[]) {
  const excluded = new Set(excludedQuestionIds);
  const freshQuestions = questionBank.filter((question) => !excluded.has(question.id));
  const source = freshQuestions.length >= questionsPerQuiz ? freshQuestions : questionBank;

  return shuffleQuestions(source)
    .slice(0, questionsPerQuiz)
    .map((question, index) => ({
      ...question,
      difficulty: `Level ${index + 1}`,
    }));
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = testLine;
  });

  lines.push(line);
  lines.forEach((textLine, index) => {
    ctx.fillText(textLine, x, y + index * lineHeight);
  });
}

function buildCertificateCanvas(playerName: string, score: number, includeImage: boolean) {
  const rank = getRank(score);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported in this browser.");
  }

  canvas.width = 1600;
  canvas.height = 1000;
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (includeImage) {
    const image = document.querySelector<HTMLImageElement>("#certificate-source-image");
    if (image?.complete && image.naturalWidth) {
      ctx.globalAlpha = 0.22;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  const logo = document.querySelector<HTMLImageElement>("#marshmallow-logo-source");

  ctx.fillStyle = "rgba(255, 248, 236, 0.9)";
  ctx.fillRect(80, 80, 1440, 840);
  ctx.strokeStyle = "#d99a24";
  ctx.lineWidth = 20;
  ctx.strokeRect(96, 96, 1408, 808);
  ctx.strokeStyle = "rgba(23, 21, 25, 0.22)";
  ctx.lineWidth = 3;
  ctx.strokeRect(138, 138, 1324, 724);

  if (logo?.complete && logo.naturalWidth) {
    ctx.drawImage(logo, 705, 126, 190, 150);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#0d8c8f";
  ctx.font = "800 34px Arial, sans-serif";
  ctx.fillText("OFFICIAL POWER LEVEL CERTIFICATE", 800, 300);

  ctx.fillStyle = "#171519";
  ctx.font = "600 40px Arial, sans-serif";
  ctx.fillText("This certifies that", 800, 370);

  ctx.fillStyle = "#ef5d52";
  ctx.font = "900 104px Arial, sans-serif";
  drawWrappedText(ctx, playerName.toUpperCase(), 800, 480, 1180, 108);

  ctx.fillStyle = "#171519";
  ctx.font = "600 34px Arial, sans-serif";
  drawWrappedText(
    ctx,
    "has successfully completed the Saiyan Assessment and achieved the rank of",
    800,
    600,
    1120,
    46,
  );

  ctx.fillStyle = "#171519";
  ctx.font = "900 76px Arial, sans-serif";
  ctx.fillText(rank.title.toUpperCase(), 800, 715);

  ctx.fillStyle = "#675f55";
  ctx.font = "700 36px Arial, sans-serif";
  ctx.fillText(`Score: ${score} / ${questionsPerQuiz}`, 800, 780);

  ctx.font = "600 32px Arial, sans-serif";
  drawWrappedText(ctx, `"${rank.message}"`, 800, 830, 1040, 42);

  ctx.fillStyle = "#0d8c8f";
  ctx.font = "800 32px Arial, sans-serif";
  ctx.fillText(discountText, 800, 895);

  ctx.fillStyle = "#171519";
  ctx.font = "800 32px Arial, sans-serif";
  ctx.fillText("Awarded by Marshmallow Tech", 800, 940);

  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Could not create certificate image."));
    }, "image/png");
  });
}

function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [playerName, setPlayerName] = useState("");
  const [current, setCurrent] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() =>
    createQuizQuestions(getAttemptRecord().usedQuestionIds),
  );
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(questionsPerQuiz).fill(null));
  const [finalScore, setFinalScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  useEffect(() => {
    setAttemptsUsed(getAttemptRecord().attempts);
  }, []);

  const score = useMemo(
    () =>
      activeQuestions.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0,
      ),
    [activeQuestions, answers],
  );
  const attemptsLeft = Math.max(maxAttemptsPerDay - attemptsUsed, 0);
  const currentQuestion = activeQuestions[current];
  const finalRank = getRank(finalScore);
  const displayName = playerName.trim() || "Anime Challenger";

  const resetQuizForAttempt = () => {
    const nextQuestions = createQuizQuestions(getAttemptRecord().usedQuestionIds);
    setCurrent(0);
    setActiveQuestions(nextQuestions);
    setAnswers(Array(nextQuestions.length).fill(null));
  };

  const addAttempt = (answeredQuestionIds: number[]) => {
    const record = getAttemptRecord();
    const nextAttempts = Math.min(record.attempts + 1, maxAttemptsPerDay);
    const nextRecord = {
      ...record,
      attempts: nextAttempts,
      usedQuestionIds: Array.from(new Set([...record.usedQuestionIds, ...answeredQuestionIds])),
    };
    saveAttemptRecord(nextRecord);
    setAttemptsUsed(nextAttempts);
    return nextAttempts;
  };

  const startQuiz = () => {
    if (attemptsLeft <= 0) {
      return;
    }

    resetQuizForAttempt();
    setScreen("quiz");
  };

  const finishAttempt = () => {
    const nextScore = score;
    const nextAttemptsUsed = addAttempt(activeQuestions.map((question) => question.id));
    setFinalScore(nextScore);

    if (nextAttemptsUsed === 1) {
      setScreen("retry");
      return;
    }

    setScreen("result");
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (answers[current] === null) {
      return;
    }

    if (current === activeQuestions.length - 1) {
      finishAttempt();
      return;
    }

    setCurrent((value) => value + 1);
  };

  const chooseAnswer = (option: string) => {
    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[current] = option;
      return nextAnswers;
    });
  };

  const getCertificateFileName = () => {
    const cleanName = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanRank = finalRank.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return `${cleanName || "anime-challenger"}-${cleanRank}-certificate.png`;
  };

  const buildCertificateForExport = () => {
    try {
      return buildCertificateCanvas(displayName, finalScore, true);
    } catch {
      return buildCertificateCanvas(displayName, finalScore, false);
    }
  };

  const openWebsiteTab = () => {
    window.open(marshmallowWebsiteUrl, "_blank", "noopener,noreferrer");
  };

  const downloadCertificatePng = () => {
    const link = document.createElement("a");

    link.download = getCertificateFileName();
    link.href = buildCertificateForExport().toDataURL("image/png");

    link.click();
    openWebsiteTab();
  };

  const shareCertificatePng = async () => {
    const fileName = getCertificateFileName();

    try {
      const blob = await canvasToPngBlob(buildCertificateForExport());
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Marshmallow Tech Power Level Certificate",
          text: `${displayName} achieved ${finalRank.title} and unlocked a 2% Marshmallow Tech discount.`,
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }
    } finally {
      openWebsiteTab();
    }
  };

  return (
    <main className="app-shell">
      <img id="certificate-source-image" src={certificateImageUrl} alt="" aria-hidden="true" />
      <img id="marshmallow-logo-source" src={logoImageUrl} alt="" aria-hidden="true" />
      <section className="quiz-panel" aria-labelledby="app-title">
        <div className="brand-row">
          <img className="brand-logo" src={logoImageUrl} alt="" aria-hidden="true" />
          <span className="brand-name">Marshmallow Tech</span>
        </div>

        {screen === "intro" && (
          <div className="intro">
            <p className="eyebrow">Anime Knowledge Trial</p>
            <h1 id="app-title">Claim Your Guild Rank</h1>
            <p className="intro-copy">
              Answer 10 questions and receive a ranked certificate based on your score.
            </p>
            <p className="attempt-note">
              {attemptsLeft > 0
                ? `${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left today.`
                : "Today's 2 attempts are complete. Come back tomorrow for a fresh run."}
            </p>

            <label className="name-field" htmlFor="player-name">
              <span>Name for certificate</span>
              <input
                id="player-name"
                type="text"
                maxLength={32}
                placeholder="Enter name"
                autoComplete="name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
              />
            </label>

            <div className="rank-strip" aria-label="Quiz rank thresholds">
              {ranksByScore.slice(1).map((rank, index) => (
                <div key={rank.title}>
                  <strong>{index + 1}</strong>
                  <span>{rank.title}</span>
                </div>
              ))}
            </div>

            <button className="primary-action" type="button" disabled={attemptsLeft <= 0} onClick={startQuiz}>
              Start quiz
            </button>
          </div>
        )}

        {screen === "quiz" && (
          <form className="question-card" onSubmit={submitAnswer}>
            <div className="quiz-topline">
              <span>
                {currentQuestion.difficulty} · Question {current + 1} of {activeQuestions.length}
              </span>
              <span>Score {score}</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }} />
            </div>
            <h2>{currentQuestion.text}</h2>
            <div className="answers">
              {currentQuestion.options.map((option) => {
                const id = `answer-${current}-${option.replace(/\W+/g, "-").toLowerCase()}`;
                return (
                  <label className="answer-option" htmlFor={id} key={option}>
                    <input
                      id={id}
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[current] === option}
                      onChange={() => chooseAnswer(option)}
                      required
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            <div className="question-actions">
              <button
                className="ghost-action"
                type="button"
                disabled={current === 0}
                onClick={() => setCurrent((value) => Math.max(value - 1, 0))}
              >
                Back
              </button>
              <button className="primary-action" type="submit">
                {current === activeQuestions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        )}

        {screen === "retry" && (
          <section className="retry-choice" aria-live="polite">
            <p className="eyebrow">First Attempt Complete</p>
            <h2>Keep this result or try one last time?</h2>
            <p>
              You scored {finalScore} out of {questionsPerQuiz}, which currently gives you {getRank(finalScore).title}.
              You can accept this certificate now or use your second and final attempt for today.
            </p>
            <div className="result-actions">
              <button className="ghost-action" type="button" onClick={() => setScreen("result")}>
                Proceed with certificate
              </button>
              <button
                className="primary-action"
                type="button"
                onClick={() => {
                  resetQuizForAttempt();
                  setScreen("quiz");
                }}
              >
                Try one last time
              </button>
            </div>
          </section>
        )}

        {screen === "result" && (
          <section className="certificate" aria-live="polite">
            <div className="certificate-inner">
              <p className="eyebrow">Official Power Level Certificate</p>
              <p className="certificate-kicker">This certifies that</p>
              <p className="winner-name">{displayName.toUpperCase()}</p>
              <p className="certificate-kicker">
                has successfully completed the Saiyan Assessment and achieved the rank of
              </p>
              <p className="rank-line">{finalRank.title.toUpperCase()}</p>
              <p className="score-line">
                Score: {finalScore} / {questionsPerQuiz}
              </p>
              <p className="certificate-note">"{finalRank.message}"</p>
              <p className="discount-line">{discountText}</p>
              <p className="certificate-awarded">Awarded by Marshmallow Tech</p>
            </div>
            <div className="result-actions">
              <button
                className="ghost-action"
                type="button"
                onClick={() => {
                  resetQuizForAttempt();
                  setScreen("intro");
                }}
              >
                Start over
              </button>
              <button className="primary-action" type="button" onClick={downloadCertificatePng}>
                Download PNG
              </button>
              <button className="primary-action" type="button" onClick={shareCertificatePng}>
                Share
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
