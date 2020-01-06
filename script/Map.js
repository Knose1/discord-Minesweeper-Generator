const TILES = ["||:white_large_square:||","||:one:||","||:two:||","||:three:||","||:four:||","||:five:||","||:six:||","||:seven:||","||:eight:||","||:nine:||"];
const BOMB = "||:bomb:||";

const BLOCK_BY_LINE = 8;

const MIN_NUM_LINE = 3;
const MAX_NUM_LINE = 12;

class Map {
    constructor(pBombSpawnCount = 8 / 100, pLineCount = 1, pBlockByLine = BLOCK_BY_LINE, pFirstTileCount = 1) {
        this.height = pLineCount || Math.floor(Math.random() * (MAX_NUM_LINE - MIN_NUM_LINE + 1)) + MIN_NUM_LINE;

        var lArray = [];
        var lMaxI = this.height;
        for (var lI = 0; lI < lMaxI; lI++) {
            lArray[lI] = [];
        }

        this.array = lArray;
        //warning : coordinate system is using this.array[Y][X]

        this.width = pBlockByLine;
        this.size = pBlockByLine * this.height;

        this.numBomb = Math.round(pBombSpawnCount * this.size);

        if (this.numBomb > this.size) {
            this.numBomb = this.size;
        }

        var lBombs = [];

        //Bomb generator
        for (lI = this.numBomb; lI > 0; lI--) {
            let lPlace = {'x':Math.floor(Math.random() * this.width), 'y':Math.floor(Math.random() * this.height)}; 

            //String is used to able the methode lBombs.indexOf(lPlace)
            var lLoopCount = 0;
            while (lBombs.indexOf(JSON.stringify(lPlace)) != -1) {
                lPlace.x++
                if (lPlace.x == this.width) {
                    lPlace.x = 0;
                    lPlace.y++;
                }
                if (lPlace.y == this.height) {
                    lPlace.y = 0;
                }
                if (lLoopCount == this.size) {
                    console.warn("Too mutch bomb");
                    break;
                }
            }
            if (lLoopCount == this.size) {
                break;
            }
            lBombs.push(JSON.stringify(lPlace));
            lArray[lPlace.y][lPlace.x] = BOMB;
        }

        this.bombs = lBombs;

        //Map Generator
        let lNumBomb;
        let lTile;
        let lNewY;
        let lWhiteTiles = [];
        let lTiles = [];
        for (let lY = this.height - 1; lY >= 0; lY--) {
            for (let lX = this.width - 1; lX >= 0; lX--) {
                lNumBomb = 0;
                if (lArray[lY][lX] == BOMB) continue;

                //Let's check how many bombs are around the current tile 
                /*
                    Relative coordinates :
                    {-1,-1} | {0,-1} | {1,-1}
                    {-1, 0} | {0, 0} | {1, 0}
                    {-1, 1} | {0, 1} | {1, 1}
                */

                for (let lRelativeY = -1; lRelativeY < 2; lRelativeY++) {
                    for (let lRelativeX = -1; lRelativeX < 2; lRelativeX++) {
                        lNewY = lY + lRelativeY
                        if (!lArray[lNewY]) continue;

                        //{0, 0} is not a bomb, so we don't need to use "continue"
                        lNumBomb += (lArray[lNewY][lX + lRelativeX] == BOMB);
                    }
                }
                
                lTile = TILES[lNumBomb];
                if (pFirstTileCount > 0)
                {
                    if (lNumBomb == 0)
                    {
                        lWhiteTiles.push({x:lX, y:lY, name:lTile});
                    }
                    else
                    {
                        lTiles.push({x:lX, y:lY, name:lTile});
                    }
                }
                    
                lArray[lY][lX] = lTile;
            }
        }
        
        for (let i = 0; i >= pFirstTileCount; i++) 
        {
            let randomTile; 
            if (lWhiteTiles.length == 0) 
            {
                if (lTiles.length == 0)
                {
                    break;
                }
                
                randomTile = lTiles.pop(Math.floor(Math.random() * lTiles.length));
            }
            else randomTile = lWhiteTiles.pop(Math.floor(Math.random() * lWhiteTiles.length));
            
            lArray[randomTile.y][randomTile.x] = this.removeSpoilerBraket(randomTile.name);
        }
        
    }
    
    removeSpoilerBraket(pString)
    {
        return pString.slice(2,pString.length - 2);
    }

    toString() {
        var lToReturn = "";
        var lLength = this.height;
        var lArray = this.array
        for (var lI = 0; lI < lLength; lI++) {
            lToReturn += lArray[lI].join("") + "\n";
        }

        return lToReturn;
    }
}
