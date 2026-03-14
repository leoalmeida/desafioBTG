# Brick Wall Problem
 
 Objetivo é encontrar a posição ideal para traçar uma linha vertical que corte o menor número possível de tijolos em uma parede representada como listas de inteiros.

## Problema

Dada uma parede composta por várias linhas de tijolos, cada uma representada por um array de larguras, o objetivo é determinar onde desenhar uma linha vertical (exceto nas extremidades) que atravessa o menor número de tijolos. Sempre que a linha passa exatamente pela borda entre dois tijolos, nenhum tijolo é cortado naquela linha.

### Exemplo:

`Input: [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]`

`Output: 4`

```python
input = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]
positions = []
for i in range(sum(input[0])-1):
  positions.append(0)
print(positions)

def brickwall(nextRows, positions):
  actualRow = nextRows[0]
  gapcount = -1
  for brick in actualRow:
    gapcount += brick
    if gapcount >= len(positions):
      break
    gapItem = positions[gapcount]
    positions[gapcount] = gapItem + 1

  del nextRows[0]
  if len(nextRows) > 0:
    brickwall(nextRows, positions)

brickwall(input, positions)
print(positions)
output = max(positions)
print(output)
```