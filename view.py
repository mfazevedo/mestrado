from model import *

benchmark = Benchmark("C:/rc101.txt")

__capacidade = benchmark.capacidade

solicitacoes = Solicitacoes(benchmark.clientes)

heuristica = VizinhoMaisProximo(solicitacoes,__capacidade)

heuristica.solucao()

solucao = ''

for rota in heuristica.rotas:
    linha = ''

    for cliente in rota.clientes:
        linha += cliente.id + ', '
    print(linha, ' = ', rota.custo)


print("Custo total = ", heuristica.custo)

