import { ScrollView, Text, View } from "react-native"

export default function FinancialEducationScreen() {
  const conteudos = [
    {
      id: '1',
      titulo: "Como controlar gastos",
      texto: "Controlar gastos é uma prática fundamental da educação financeira, pois permite ao indivíduo compreender para onde o seu dinheiro está sendo direcionado e tomar decisões mais conscientes sobre seu uso. O primeiro passo para esse controle é registrar todas as entradas e saídas de dinheiro, incluindo despesas fixas (como aluguel, contas de água, luz e internet) e despesas variáveis (como lazer, alimentação fora de casa e compras ocasionais).\nUma forma eficiente de controlar gastos é organizar as despesas em categorias, o que facilita a visualização de quais áreas consomem mais recursos. Esse registro pode ser feito por meio de planilhas, cadernos ou aplicativos de controle financeiro. A análise periódica desses dados permite identificar padrões de consumo, desperdícios e oportunidades de economia.\nAlém disso, controlar gastos ajuda no planejamento financeiro, pois possibilita estabelecer metas, como economizar dinheiro, quitar dívidas ou investir. Quando uma pessoa tem clareza sobre seus gastos, ela consegue ajustar seus hábitos de consumo e manter suas finanças mais equilibradas."
    },
    {
      id: "2",
      titulo: "Como montar uma reserva de emergência",
      texto: "A reserva de emergência é um valor guardado para lidar com situações inesperadas, como perda de emprego, problemas de saúde, reparos urgentes na casa ou outras despesas imprevistas. Ela funciona como uma proteção financeira, evitando que a pessoa precise recorrer a empréstimos ou dívidas em momentos de dificuldade.\nO ideal é que a reserva de emergência corresponda a aproximadamente de três a seis meses do custo de vida mensal da pessoa ou da família. Para calcular esse valor, é necessário somar todas as despesas essenciais, como moradia, alimentação, transporte, contas básicas e saúde.\nA construção dessa reserva deve ser feita gradualmente, separando uma parte da renda mensal até atingir o valor desejado. Esse dinheiro deve ser guardado em um local seguro e de fácil acesso, como aplicações financeiras de baixo risco e alta liquidez, para que possa ser utilizado rapidamente quando necessário.\nManter uma reserva de emergência traz segurança e tranquilidade, pois reduz o impacto financeiro de situações inesperadas e ajuda a manter a estabilidade das finanças pessoais."
    },
    {
      id: "3",
      titulo: "Diferença entre receita e lucro",
      texto: "Os conceitos de receita e lucro são frequentemente confundidos, mas possuem significados diferentes na área financeira e contábil.\nA receita representa todo o dinheiro que entra, seja em uma empresa ou nas finanças pessoais. No caso de um negócio, por exemplo, a receita é o valor total obtido com a venda de produtos ou serviços, antes de descontar qualquer tipo de gasto.\nJá o lucro corresponde ao valor que sobra após a dedução de todas as despesas e custos. Isso inclui gastos com produção, salários, impostos, aluguel, contas operacionais e outros custos necessários para manter a atividade.\nEm termos simples:\nReceita → todo dinheiro que entra.\nLucro → dinheiro que sobra depois de pagar todas as despesas.\nPor exemplo, se uma empresa vende R$10.000 em produtos no mês, essa é a sua receita. Se os custos totais forem R$7.000, o lucro será de R$3.000. Esse indicador é essencial para avaliar a saúde financeira de um negócio, pois mostra se ele realmente está gerando ganho financeiro."
    },
    {
      id: "4",
      titulo: "Regra 50/30/20",
      texto: "A regra 50/30/20 é um método simples de organização financeira que ajuda a distribuir a renda mensal de forma equilibrada. Essa estratégia divide o dinheiro em três categorias principais.\nA primeira categoria corresponde a 50% da renda, destinada às necessidades essenciais. Nessa parte entram despesas indispensáveis para a vida cotidiana, como aluguel, alimentação, transporte, contas de serviços e saúde.\nA segunda categoria corresponde a 30% da renda, reservada para desejos e estilo de vida. Isso inclui lazer, entretenimento, viagens, compras não essenciais e outras atividades que proporcionam conforto ou diversão.\nA terceira categoria corresponde a 20% da renda, destinada à poupança e investimentos. Esse valor pode ser utilizado para construir uma reserva de emergência, investir para objetivos futuros ou pagar dívidas.\nEssa regra é amplamente utilizada por ser simples e fácil de aplicar, ajudando as pessoas a manter um equilíbrio entre necessidades, qualidade de vida e planejamento financeiro para o futuro."
    }
  ]

  return (
      <ScrollView  className="flex-1 bg-background p-5">
        {conteudos.map((item) => (
          <View key={item.id} className="bg-card p-2 rounded-xl mb-8">
            <Text className="text-xl font-bold text-textPrimary mb-2">{item.titulo}</Text>
            <Text className="text-textPrimary text-justify">{item.texto}</Text>
          </View>
        ))}
      </ScrollView>
  );

}