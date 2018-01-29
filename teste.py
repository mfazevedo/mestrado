from math import sqrt
from abc import ABC, abstractmethod

#------------------------------------------------------------------------
# Classe abstrata para ser superclasse de cada heuristica criada
#------------------------------------------------------------------------
class Heuristica(ABC):

    def __init__(self, solicitaces, capacidade):
        self._clientes   = solicitaces.clientes
        self._capacidade = capacidade
        self._rotas      = []

    @property
    def clientes(self):
        return self._clientes

    @property
    def capacidade(self):
        return self._capacidade

    @property
    def rotas(self):
        return self._rotas

    @rotas.setter
    def rotas(self, valor):
        self._rotas += valor

    @property
    def custo(self):
        custo = 0.0
        for i in range(len(self.clientes) - 1):
            destino = self.clientes[i + 1]
            cliente = self.clientes[i]
            custo += cliente.distancia(destino)
        return custo

    #def remove_atendido(self, id):
    #    for x in self.clientes:
    #        if x.id == id:
    #            self.clientes.remove(x)
    #    return

    @abstractmethod
    def solucao(self):
        pass

#------------------------------------------------------------------------
# Classe filha de heuristica que contem a implementação da solução
#------------------------------------------------------------------------
class VizinhoMaisProximo(Heuristica):

    def solucao(self):

        deposito = self.clientes[0]
        del self.clientes[0]

        while not(self.clientes == []):

            veiculo_atual = Veiculo(self.capacidade)
            rota = Rota(veiculo_atual, deposito)

            atendimentos_possiveis = self.clientes[:]

            while len(atendimentos_possiveis) > 0:
                origem  = rota.clientes[-1] #Último cliente no array
                proximo = origem.mais_proximo(atendimentos_possiveis)

                if veiculo_atual.comporta(proximo):
                    rota.clientes = proximo
                    veiculo_atual.carga = proximo.demanda
                    self.clientes.remove(proximo)

                atendimentos_possiveis.remove(proximo)

            rota.fecha_rota() #Atribui o Depósito como ultimo cliente

            self.rotas.append(rota)

#------------------------------------------------------------------------
# Classe responsável por carregar os dados de cada atendimento / cliente
#------------------------------------------------------------------------
class Cliente (object):

    def __init__(self, id, x, y, dem, ini, fim, serv, dinam):
        self._id        = id      #Id cliente
        self._x         = x       #Coordenada X do local do atendimento
        self._y         = y       #Coordenada Y do local do atendimento
        self._demanda   = dem     #Demanda do cliente
        self._iniatd    = ini     #Inicio da janela de atendimento
        self._fimatd    = fim     #Fim da janela de atendimento
        self._servico   = serv    #Tempo de serviço
        self._dinamismo = dinam   #Variavel dinamica

    #Definindo as propriedades para trabalhar com encapsulamento
    @property
    def id(self):
        return self._id
    @property
    def x(self):
        return self._x
    @property
    def y(self):
        return self._y
    @property
    def demanda(self):
        return self._demanda
    @property
    def iniatd(self):
        return self._iniatd
    @property
    def fimatd(self):
        return self._fimatd
    @property
    def servico(self):
        return self._servico
    @property
    def dinamismo(self):
        return self._dinamismo

    def mais_proximo(self, clientes):

        clientes = clientes

        if not (self.id == clientes[0].id):
            custo = self.distancia(clientes[0])  # Toma como menor distância inicial a distância do depósito até o primeiro cliente listado
            retorno = clientes[0]
        else:
            custo = self.distancia(clientes[1])  # Toma como menor distância inicial a distância do depósito até o segundo cliente listado
            retorno = clientes[1]

        for destino in clientes:
            novo_custo = self.distancia(destino)

            if novo_custo < custo and not (self.id == destino.id):
                custo = novo_custo
                retorno = destino

        return retorno

    def distancia(self, destino):
        x1 = self.x
        y1 = self.y
        x2 = destino.x
        y2 = destino.y

        retorno = sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

        return retorno

#------------------------------------------------------------------------
# Classe responsável por carregar os dados dos veículos
#------------------------------------------------------------------------
class Veiculo(object):
    def __init__(self, capacidade):
        self._capacidade = capacidade  # Capacidade do veículo
        self._carga = 0.0  # Carga aplicada no veículo. Não pode ultrapassar a capacidade

    # Definindo as propriedades para trabalhar com encapsulamento
    @property
    def capacidade(self):
        return self._capacidade

    @property
    def carga(self):
        return self._carga

    @carga.setter
    def carga(self, valor):
        self._carga += valor

    def comporta(self, cliente):
        demanda = cliente.demanda
        retorno = True

        if self.carga + demanda > self.capacidade:
            retorno = False

        return retorno

#-----------------------------------------------------------------------------
# Classe que lida com a lista de clientes que compões parte da solução
#-----------------------------------------------------------------------------
class Rota(object):

    def __init__(self, veiculo, deposito):
        self._veiculo  = veiculo
        self._deposito = deposito
        self._clientes = []
        self._clientes.append(self.deposito)

    @property
    def veiculo(self):
        return self._veiculo

    @property
    def clientes(self):
        return self._clientes

    @property
    def deposito(self):
        return self._deposito

    @property
    def custo(self):
        custo = 0.0
        for i in range(len(self.clientes)- 1):
            destino = self.clientes[i+1]
            cliente = self.clientes[i]
            custo  += cliente.distancia(destino)
        return custo

    @clientes.setter
    def clientes(self, valor):
        self._clientes += valor

    def fecha_rota(self):
        self.clientes.append(self.deposito)


# ---------------------------------------------------------------------------
# Classe responsável por carregar a lista de atendimentos a serem realizados
# ---------------------------------------------------------------------------
class solicitacoes(object):

    def __init__(self, clientes):
        self._clientes = clientes

    @property
    def clientes(self):
        return self._clientes


# --------------------------------------------------------------------------------
# Classe responsável por carregar as informações do arquivo de texto do benchmark
# --------------------------------------------------------------------------------
class Benchmark(object):

    _linha_inicial    = 9  #Constante que define a linha onde o arquivo de benchmark começa a apresentar informações sobre roteamento
    _linha_capacidade = 5
    #_caminho          = "C:/rc101.txt"

    def __init__(self, caminho):
        self._capacidade  = 0.0
        self._clientes    = []
        self._num_veiculos = 0

        arquivo = open(caminho, 'r')
        linhas = arquivo.readlines()
        cont = 0

        for linha in linhas:
            cont += 1
            if cont == self._linha_capacidade:
                self._capacidade = float(linha[13:16].strip())
                self._num_veiculos = int(linha[3:4].strip())

            if cont > self._linha_inicial:
                id = linha[3:5].strip()
                x = float(linha[10:13].strip())
                y = float(linha[22:24].strip())
                demanda = float(linha[33:35].strip())
                iniatd = float(linha[43:46].strip())
                fimatd = float(linha[54:57].strip())
                serv = float(linha[66:68].strip())
                dinam = 0.0

                self.clientes = Cliente(id, x, y, demanda, iniatd, fimatd, serv,dinam)  # insere um cliente com as especificações mo array

    #Definindo as propriedades para trabalhar com encapsulamento
    @property
    def capacidade(self):
        return self._capacidade
    @property
    def clientes(self):
        return self._clientes
    @property
    def num_veiculos(self):
        return self._num_veiculos

    @clientes.setter
    def clientes(self, valor):
        self._clientes.append(valor)

