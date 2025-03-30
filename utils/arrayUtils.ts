import { Positions } from "../types/sessionTypes";
import { Session } from "../types/sessionTypes";

export function clamp(
  value: number,
  lowerBound: number,
  upperBound: number
): number {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

export function objectMove(
  object: Positions,
  from: number,
  to: number
): Positions {
  "worklet";
  const newObject: Positions = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

export function listToObject(list: Session[]): Positions {
  const values = Object.values(list);
  const object: Positions = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}
