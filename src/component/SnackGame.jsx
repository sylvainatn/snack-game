import React, { useState, useEffect, useCallback, useRef } from 'react';

// Taille de chaque "case" du serpent et de la nourriture
const box = 20;

// Fonction pour générer la position aléatoire de la nourriture
const generateFood = () => ({
   x: Math.floor(Math.random() * 20) * box,
   y: Math.floor(Math.random() * 20) * box
});

const SnakeGame = () => {

   const [snake, setSnake] = useState([{ x: null, y: null }]); // Position du serpent
   const [food, setFood] = useState(generateFood()); // Position de la nourriture
   const [direction, setDirection] = useState(''); // Direction RIGHT, LEFT, UP, DOWN
   const [score, setScore] = useState(0); // Score
   const [gameOver, setGameOver] = useState(false);
   const [gameStarted, setGameStarted] = useState(false);
   const [speed, setSpeed] = useState(100); // Vitesse

   const canvasRef = useRef(null); // Utilisation d'un ref pour accéder au canvas

   // Détecter les touches de direction
   const handleKeyDown = useCallback((e) => {
      if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
         setDirection('LEFT');
      } else if (e.key === 'ArrowUp' && direction !== 'DOWN') {
         setDirection('UP');
      } else if (e.key === 'ArrowRight' && direction !== 'LEFT') {
         setDirection('RIGHT');
      } else if (e.key === 'ArrowDown' && direction !== 'UP') {
         setDirection('DOWN');
      }
   }, [direction]);

   // Mise à jour de l'état du jeu (mouvement du serpent, collision, score)
   useEffect(() => {

      if (!gameStarted || gameOver) return;

      const gameInterval = setInterval(() => {

         const head = snake[0];

         console.log(head);
         let newHead;
         if (direction === 'LEFT') newHead = { x: head.x - box, y: head.y };
         if (direction === 'UP') newHead = { x: head.x, y: head.y - box };
         if (direction === 'RIGHT') newHead = { x: head.x + box, y: head.y };
         if (direction === 'DOWN') newHead = { x: head.x, y: head.y + box };

         // Vérification de la collision avec les bords du canvas
         if (
            newHead.x < 0 || newHead.y < 0 || newHead.x >= 400 || newHead.y >= 400 ||
            snake.some(s => s.x === newHead.x && s.y === newHead.y)
         ) {
            setGameOver(true);
            clearInterval(gameInterval);
            return;
         }



         // Si le serpent mange la nourriture
         if (newHead.x === food.x && newHead.y === food.y) {
            setScore(prevScore => prevScore + 1);
            setFood(generateFood());
            setSnake(prevSnake => [newHead, ...prevSnake]);
         } else {
            setSnake(prevSnake => [newHead, ...prevSnake.slice(0, -1)]);
         }
      }, speed);

      // Gestion des événements de touche
      document.addEventListener('keydown', handleKeyDown);

      return () => {
         clearInterval(gameInterval);
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [direction, snake, food, gameOver, gameStarted, handleKeyDown]);

   // Démarrer le jeu
   const startGame = () => {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setSnake([{ x: 5 * box, y: 5 * box }]);
      setFood(generateFood());
      setDirection('RIGHT');
      setSpeed(100);
   };

   // Dessin du jeu (le serpent, la nourriture)
   useEffect(() => {
      const canvas = canvasRef.current; // Utilisez canvasRef pour accéder au canvas
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Dessin du serpent
      ctx.fillStyle = "#82d544";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Efface le canvas

      for (let i = 0; i < snake.length; i++) {
         ctx.fillStyle = i === 0 ? "#3498db" : "#2ecc71"; // Couleur de la tête et du corps du serpent
         ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }

      // Dessin de la nourriture
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(food.x, food.y, box, box);

   }, [snake, food]); // Mise à jour du dessin à chaque fois que le serpent ou la nourriture change

   return (
      <div style={{ textAlign: 'center' }}>
         <h1>Jeu Snake</h1>
         {gameOver ? (
            <div>
               <h2>Game Over! Score: {score}</h2>
               <button onClick={startGame}>Recommencer</button>
            </div>
         ) : !gameStarted ? (
            <div>
               <h2>Appuyez sur "Commencer" pour jouer !</h2>
               <button onClick={startGame}>Commencer</button>
            </div>
         ) : (
            <div>
               {/* Affichage du score en dehors du canvas */}
               <div style={{ marginBottom: '20px' }}>
                  <h3>Score: {score}</h3>
               </div>
               <canvas
                  ref={canvasRef} // Attacher le ref au canvas
                  width="400"
                  height="400"
                  style={{ border: '2px solid #2c3e50', backgroundcolor: "black" }}
               ></canvas>
            </div>
         )}
      </div>
   );
};

export default SnakeGame;
