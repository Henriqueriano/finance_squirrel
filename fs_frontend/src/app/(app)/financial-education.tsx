import { useTheme } from "@/src/hooks/use-theme"
import { useMemo } from "react"
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"

const ComoControlarGastosImg = require("@/assets/images/como-controlar-gastos.png")
const ReservaDeEmergencia = require("@/assets/images/reserva-de-emergencia.png")
const DiferencaEntreReceitaLucro = require("@/assets/images/diferenca-entre-receita-lucro.png")
const Regra503020 = require("@/assets/images/regra-50-30-20.png")

const conteudos = [
  {
    id: "1",
    img: ComoControlarGastosImg,
    titulo: "Como controlar gastos",
    texto:
      "\t\tControlar gastos é uma prática fundamental da educação financeira, pois permite ao indivíduo compreender para onde o seu dinheiro está sendo direcionado e tomar decisões mais conscientes sobre seu uso. O primeiro passo para esse controle é registrar todas as entradas e saídas de dinheiro, incluindo despesas fixas (como aluguel, contas de água, luz e internet) e despesas variáveis (como lazer, alimentação fora de casa e compras ocasionais).\n\t\tUma forma eficiente de controlar gastos é organizar as despesas em categorias, o que facilita a visualização de quais áreas consomem mais recursos. Esse registro pode ser feito por meio de planilhas, cadernos ou aplicativos de controle financeiro. A análise periódica desses dados permite identificar padrões de consumo, desperdícios e oportunidades de economia.\n\t\tAlém disso, controlar gastos ajuda no planejamento financeiro, pois possibilita estabelecer metas, como economizar dinheiro, quitar dívidas ou investir. Quando uma pessoa tem clareza sobre seus gastos, ela consegue ajustar seus hábitos de consumo e manter suas finanças mais equilibradas.",
  },
  {
    id: "2",
    img: ReservaDeEmergencia,
    titulo: "Como montar uma reserva de emergência",
    texto:
      "\t\tA reserva de emergência é um valor guardado para lidar com situações inesperadas, como perda de emprego, problemas de saúde, reparos urgentes na casa ou outras despesas imprevistas. Ela funciona como uma proteção financeira, evitando que a pessoa precise recorrer a empréstimos ou dívidas em momentos de dificuldade.\n\t\tO ideal é que a reserva de emergência corresponda a aproximadamente de três a seis meses do custo de vida mensal da pessoa ou da família. Para calcular esse valor, é necessário somar todas as despesas essenciais, como moradia, alimentação, transporte, contas básicas e saúde.\n\t\tA construção dessa reserva deve ser feita gradualmente, separando uma parte da renda mensal até atingir o valor desejado. Esse dinheiro deve ser guardado em um local seguro e de fácil acesso, como aplicações financeiras de baixo risco e alta liquidez, para que possa ser utilizado rapidamente quando necessário.\n\t\tManter uma reserva de emergência traz segurança e tranquilidade, pois reduz o impacto financeiro de situações inesperadas e ajuda a manter a estabilidade das finanças pessoais.",
  },
  {
    id: "3",
    img: DiferencaEntreReceitaLucro,
    titulo: "Diferença entre receita e lucro",
    texto:
      "\t\tOs conceitos de receita e lucro são frequentemente confundidos, mas possuem significados diferentes na área financeira e contábil.\n\t\tA receita representa todo o dinheiro que entra, seja em uma empresa ou nas finanças pessoais. No caso de um negócio, por exemplo, a receita é o valor total obtido com a venda de produtos ou serviços, antes de descontar qualquer tipo de gasto.\n\t\tJá o lucro corresponde ao valor que sobra após a dedução de todas as despesas e custos. Isso inclui gastos com produção, salários, impostos, aluguel, contas operacionais e outros custos necessários para manter a atividade.\nEm termos simples:\n\t\t- Receita → todo dinheiro que entra.\n\t\t- Lucro → dinheiro que sobra depois de pagar todas as despesas.\n\t\tPor exemplo, se uma empresa vende R$10.000 em produtos no mês, essa é a sua receita. Se os custos totais forem R$7.000, o lucro será de R$3.000. Esse indicador é essencial para avaliar a saúde financeira de um negócio, pois mostra se ele realmente está gerando ganho financeiro.",
  },
  {
    id: "4",
    img: Regra503020,
    titulo: "Regra 50/30/20",
    texto:
      "\t\tA regra 50/30/20 é um método simples de organização financeira que ajuda a distribuir a renda mensal de forma equilibrada. Essa estratégia divide o dinheiro em três categorias principais.\n\t\tA primeira categoria corresponde a 50% da renda, destinada às necessidades essenciais. Nessa parte entram despesas indispensáveis para a vida cotidiana, como aluguel, alimentação, transporte, contas de serviços e saúde.\n\t\tA segunda categoria corresponde a 30% da renda, reservada para desejos e estilo de vida. Isso inclui lazer, entretenimento, viagens, compras não essenciais e outras atividades que proporcionam conforto ou diversão.\n\t\tA terceira categoria corresponde a 20% da renda, destinada à poupança e investimentos. Esse valor pode ser utilizado para construir uma reserva de emergência, investir para objetivos futuros ou pagar dívidas.\n\t\tEssa regra é amplamente utilizada por ser simples e fácil de aplicar, ajudando as pessoas a manter um equilíbrio entre necessidades, qualidade de vida e planejamento financeiro para o futuro.",
  },
]

export default function FinancialEducationScreen() {
  const { colors } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.background,
        },

        contentContainer: {
          padding: 8,
        },

        card: {
          backgroundColor: colors.card,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,

          elevation: 6,
        },

        image: {
          width: "100%",
          height: 220,
        },

        body: {
          padding: 18,
        },

        title: {
          color: colors.text,
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 16,
          lineHeight: 32,
        },

        paragraph: {
          color: colors.text,
          fontSize: 16,
          lineHeight: 28,
          marginBottom: 16,
          opacity: 0.9,
        },
      }),
    [colors],
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {conteudos.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.img} style={styles.image} resizeMode="cover" />

          <View style={styles.body}>
            <Text style={styles.title}>{item.titulo}</Text>

            {item.texto
              .split("\n")
              .filter((paragraph) => paragraph.trim() !== "")
              .map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph.trim()}
                </Text>
              ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
