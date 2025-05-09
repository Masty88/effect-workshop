import { Console, Effect, Layer, Schedule, pipe } from "effect";
import { get } from "effect/Chunk";
import { parse } from "effect/Cron";
import * as Schema from "effect/schema";

const getRandomNumber = Effect.sync(() => Math.random() * 10);

const checkIfAtLeastFive = (n: number) =>
  n>5 ? Effect.succeed(n) : Effect.fail(new Error("less than 5"));

const logNumber = (n: number) => Effect.log(n.toString());

const program = pipe(
  getRandomNumber,
  Effect.map((x) => x * 2),
  Effect.flatMap(checkIfAtLeastFive),
  Effect.flatMap(logNumber)
);

Effect.runSync(program)

const getPokemon = (id: number) =>pipe(
  Effect.tryPromise({
    try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
    catch: (e) => new Error("Failed to fetch pokemon"),
  }),
  Effect.flatMap((x)=> parsePokemon(x)),
)

const  getRandomNumberArray =
  Array.from({ length: 10 }, () =>
    Effect.sync(() => Math.floor(Math.random() * 10))
  );


const pokemonSchema = Schema.struct({
  name: Schema.string,
  weight: Schema.number,
});

type Pokemon = Schema.To<typeof pokemonSchema>;
const parsePokemon = Schema.parse(pokemonSchema);

const program2 = pipe(
  getRandomNumberArray,
  Effect.flatMap((arr)=> Effect.all(arr.map(getPokemon)))
)