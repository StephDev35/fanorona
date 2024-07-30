"use client";
import React, { useState, useEffect, useRef } from "react";
import Loaders from "@/components/Looaders";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "../../components/Draggable";
import { Droppable } from "../../components/Droppable";
import Imagewin from "../../../public/win.png";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import Mode from "@/components/Mode";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Fireworks animation CSS
const fireworksAnimation = `
    @keyframes fireworks-bang {
      to {
        box-shadow: 114px -107.333px #8800ff, 212px -166.333px #a600ff, 197px -6.333px #ff006a, 179px -329.333px #3300ff, -167px -262.333px #ff0062, 233px 65.666px #ff008c, 81px 42.666px #0051ff, -13px 54.666px #00ff2b, -60px -183.333px #0900ff, 127px -259.333px #ff00e6, 117px -122.333px #00b7ff, 95px 20.666px #ff8000, 115px 1.666px #0004ff, -160px -328.333px #00ff40, 69px -242.333px #000dff, -208px -230.333px #ff0400, 30px -15.333px #e6ff00, 235px -15.333px #fb00ff, 80px -232.333px #d5ff00, 175px -173.333px #00ff3c, -187px -176.333px #aaff00, 4px 26.666px #ff6f00, 227px -106.333px #ff0099, 119px 17.666px #00ffd5, -102px 4.666px #ff0088, -16px -4.333px #00fff7, -201px -310.333px #00ffdd, 64px -181.333px #f700ff, -234px -15.333px #00fffb, -184px -263.333px #aa00ff, 96px -303.333px #0037ff, -139px 10.666px #0026ff, 25px -205.333px #00ff2b, -129px -322.333px #40ff00, -235px -187.333px #26ff00, -136px -237.333px #0091ff, -82px -321.333px #6a00ff, 7px -267.333px #ff00c8, -155px 30.666px #0059ff, -85px -73.333px #6a00ff, 60px -199.333px #55ff00, -9px -289.333px #00ffaa, -208px -167.333px #00ff80, -13px -299.333px #ff0004, 179px -164.333px #ff0044, -112px 12.666px #0051ff, -209px -125.333px #ff00bb, 14px -101.333px #00ff95, -184px -292.333px #ff0099, -26px -168.333px #09ff00, 129px -67.333px #0084ff, -17px -23.333px #0059ff, 129px 34.666px #7300ff, 35px -24.333px #ffd900, -12px -297.333px #ff8400, 129px -156.333px #0dff00, 157px -29.333px #1a00ff, -221px 6.666px #ff0062, 0px -311.333px #ff006a, 155px 50.666px #00ffaa, -71px -318.333px #0073ff;
      }
    }

    .fireworks {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background-color: transparent;
      border-radius: 50%;
      animation: fireworks-bang 3s ease-in-out infinite;
      z-index: 9999;
      pointer-events: none;
    }
  `;

export default function Jouer() {

   
  const [boules1, setBoules1] = useState([
    { id: 1, nom: "Boule 1", parent: null },
    { id: 2, nom: "Boule 2", parent: null },
    { id: 3, nom: "Boule 3", parent: null },
  ]);
  const [boules2, setBoules2] = useState([
    { id: 4, nom: "Boule 4", parent: null },
    { id: 5, nom: "Boule 5", parent: null },
    { id: 6, nom: "Boule 6", parent: null },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [allBoulesPlaced, setAllBoulesPlaced] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");

  const timerRef = useRef(null);

  const LesCases = [
    { id: 1, nom: "case 1" },
    { id: 2, nom: "case 2" },
    { id: 3, nom: "case 3" },
    { id: 4, nom: "case 4" },
    { id: 5, nom: "case 5" },
    { id: 6, nom: "case 6" },
    { id: 7, nom: "case 7" },
    { id: 8, nom: "case 8" },
    { id: 9, nom: "case 9" },
  ];

  const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  const checkWinner = (boules) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        boules.some((boule) => boule.parent === `droppable-${a}`) &&
        boules.some((boule) => boule.parent === `droppable-${b}`) &&
        boules.some((boule) => boule.parent === `droppable-${c}`)
      ) {
        return true;
      }
    }
    return false;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const [type, id] = active.id.split("-");
    const bouleId = parseInt(id);

    if (over && !winner) {
      const isOccupied =
        boules1.some((boule) => boule.parent === over.id) ||
        boules2.some((boule) => boule.parent === over.id);

      if (!isOccupied) {
        if (type === "draggable1" && currentPlayer === 1) {
          setBoules1((prevBoules) => {
            const newBoules = prevBoules.map((boule) =>
              boule.id === bouleId ? { ...boule, parent: over.id } : boule
            );
            if (checkWinner(newBoules)) {
              setWinner("Player 1 (Blue)");
            }
            return newBoules;
          });
          setCurrentPlayer(2);
        } else if (type === "draggable2" && currentPlayer === 2) {
          setBoules2((prevBoules) => {
            const newBoules = prevBoules.map((boule) =>
              boule.id === bouleId ? { ...boule, parent: over.id } : boule
            );
            if (checkWinner(newBoules)) {
              setWinner("Player 2 (Green)");
            }
            return newBoules;
          });
          setCurrentPlayer(1);
        }
      }
    }
  };

  useEffect(() => {
    const allBoulesPlaced =
      boules1.every((boule) => boule.parent !== null) &&
      boules2.every((boule) => boule.parent !== null);
    if (allBoulesPlaced && !winner) {
      setAllBoulesPlaced(true);
      setTimeout(() => {
        setBoules1(boules1.map((boule) => ({ ...boule, parent: null })));
        setBoules2(boules2.map((boule) => ({ ...boule, parent: null })));
        setCurrentPlayer(1);
        setAllBoulesPlaced(false);
        setStartTime(new Date());
      }, 2000);
    }
  }, [boules1, boules2, winner]);

  useEffect(() => {
    if (winner || allBoulesPlaced) {
      clearInterval(timerRef.current);
    }
  }, [winner, allBoulesPlaced]);

  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const seconds = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setElapsedTime(
          `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`
        );
      }, 2000);

      return () => clearInterval(timerRef.current);
    }
  }, [startTime]);

  const handleNewGame = () => {
    setBoules1([
      { id: 1, nom: "Boule 1", parent: null },
      { id: 2, nom: "Boule 2", parent: null },
      { id: 3, nom: "Boule 3", parent: null },
    ]);
    setBoules2([
      { id: 4, nom: "Boule 4", parent: null },
      { id: 5, nom: "Boule 5", parent: null },
      { id: 6, nom: "Boule 6", parent: null },
    ]);
    setCurrentPlayer(1);
    setWinner(null);
    setAllBoulesPlaced(false);
    setStartTime(new Date());
  };

  const getDraggable = (id, type) => {
    return (
      <Draggable key={id} id={`${type}-${id}`}>
        <div
          className={`rounded-full ${
            type === "draggable1" ? "bg-blue-500" : "bg-green-500"
          } h-20 w-20 shadow-xl`}
        ></div>
      </Draggable>
    );
  };

  const remainingBoules1 = boules1.filter((boule) => boule.parent === null);
  const remainingBoules2 = boules2.filter((boule) => boule.parent === null);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center p-4 gap-3 md:justify-center">
        <div className="h-[40px] w-[200px] md:flex flex justify-center gap-2 items-center shadow-2xl">
          <h1>
            <span>Time: </span>{elapsedTime}
          </h1>
          <Mode theme={theme} setTheme={setTheme} />
        </div>
        <DndContext onDragEnd={handleDragEnd}>
          {winner && (
            <AnimatePresence>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertDialog open={true} onOpenChange={() => setWinner(null)}>
                  <AlertDialogContent>
                    <style>{fireworksAnimation}</style>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Resultat</AlertDialogTitle>
                      <AlertDialogDescription className="flex justify-center items-center">
                        <div className="">
                          <p className="">{winner} wins!</p>
                          <p className="">Time {elapsedTime}</p>
                        </div>
                        <Image
                          src={Imagewin}
                          alt="alt"
                          width={100}
                          height={100}
                        />
                      </AlertDialogDescription>
                      <div className="fireworks"></div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={handleNewGame}>
                        Nouveau jeu
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            </AnimatePresence>
          )}
          <Card className="flex gap-3 p-2 h-28 w-72">
            {remainingBoules1.map((item) => getDraggable(item.id, "draggable1"))}
          </Card>
          <div className="grid grid-cols-3 gap-1 w-80 mt-4">
            {LesCases.map((item) => (
              <Droppable key={item.id} id={`droppable-${item.id}`}>
                <Card className="bg-white md:h-28 h-24 flex justify-center items-center border border-gray-300">
                  {boules1
                    .filter((boule) => boule.parent === `droppable-${item.id}`)
                    .map((boule) => getDraggable(boule.id, "draggable1"))}
                  {boules2
                    .filter((boule) => boule.parent === `droppable-${item.id}`)
                    .map((boule) => getDraggable(boule.id, "draggable2"))}
                  {!boules1.some(
                    (boule) => boule.parent === `droppable-${item.id}`
                  ) &&
                    !boules2.some(
                      (boule) => boule.parent === `droppable-${item.id}`
                    ) && <p></p>}
                </Card>
              </Droppable>
            ))}
          </div>
          <Card className="flex gap-3 p-2 h-24 w-72 mt-4">
            {remainingBoules2.map((item) => getDraggable(item.id, "draggable2"))}
          </Card>
        </DndContext>
        {allBoulesPlaced && (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-50">
            <p className="p-4 text-2xl text-white font-bold">Restart...</p>
            <Loaders />
          </div>
        )}
      </div>
    </>
  );
}
