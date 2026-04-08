# **Crumble Quest**

A fast-paced bakery management desktop-browser game built with **p5.ts**. Manage ingredients, bake recipes, and keep your customers happy!
<br><br>
**Crumble Quest Link**: https://mizryl.github.io/crumble-quest/

---


## **Tech Stack**

* **Language**: TypeScript
* **Library**: p5.js
* **Sound Engine**: p5.sound

---

## **Build Instructions**

This project uses TypeScript. To get the bakery up and running locally, follow these steps:

1. **Install Dependencies**: 
   Run `npm install` in your terminal to install the necessary TypeScript types and libraries.
   
2. **Watch for Changes**: 
   Run `tsc -w` to enter **Watch Mode**. This will automatically compile your `.ts` files into `.js` every time you save.

3. **Launch the Game**: 
   Open `index.html` using a local server (like the **Live Server** extension in VS Code) to play.

---

## **Controls**

| Key | Action |
| :--- | :--- |
| **WASD** | Move Baker |
| **E / Click** | Interact (Pick up / Drop / Take Order) |
| **F / Space** | Process (Chop / Mix / Bake) |
| **ESC** | Toggle Recipe Book & Pause |

---

## **Key Features**

* **Save & Load**: Progress is stored in `localStorage`, so you can resume your bakery empire anytime.
* **Recipe Book**: Searchable guide to help you remember every ingredient combination.
* **Movement Logger**: Built-in analytics tool that exports reports on player and customer efficiency.
* **Adaptive Audio**: Seamless background music that persists through menu transitions.
