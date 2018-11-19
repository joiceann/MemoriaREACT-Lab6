import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import carta1 from './assets/carta1.png'
import carta2 from './assets/carta2.png';
import carta3 from './assets/carta3.png'
import carta4 from './assets/carta4.png'
import carta5 from './assets/carta5.png'
import carta6 from './assets/carta6.png'
import carta7 from './assets/carta7.png'
import carta8 from './assets/carta8.png'
import FlipCard from "react-flipcard-2"


const baraja =[ carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8];



class App extends React.Component{
	
	constructor(props){
		super(props);
		this.state = this.estadoInicial();
	}

	estadoInicial(){
		const baraja = this.crearBaraja();
		return {
			baraja,
			pareja:[],
			comparando:false,
			intentos:0
		};
	}

	crearBaraja(){
		const imagenes=this.shuffleArray([0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7])
		let baraja=[]
		for (let imagen of imagenes){
			let carta={
				img: imagen,
				adivinada: false
			}
			baraja.push(carta);
		}
		return baraja;
	}

	

	seleccionarCarta(carta){
		if (this.state.comparando || this.state.pareja.indexOf(carta)>-1 || carta.adivinada){
			return;
		}

		const pareja = [...this.state.pareja, carta];
		this.setState({
			pareja
		})

		if (pareja.length===2){
			this.comparar(pareja);		
		}

	}

	comparar(pareja){
		this.setState({comparando:true});
		setTimeout(()=>{
			const [primera, segunda]= pareja;
			let baraja = this.state.baraja;

			if (primera.img=== segunda.img){
				 baraja= baraja.map((carta)=>{
					if (carta.img !== primera.img){
						return carta;
					}
					let cartaTemp={
						img: carta.img,
						adivinada: true
					}
					return cartaTemp;
				 })
				 this.verificarGanar(baraja)
				 this.setState({
					 pareja:[],
					 baraja,
					 comparando:false,
					 intentos:this.state.intentos+1
				 })
			}

			else{ 
				this.setState({
				pareja:[],
				baraja,
				comparando:false,
				intentos:this.state.intentos+1
				})

			}
		}, 700)

	}

	verificarGanar(baraja){

		if (baraja.filter((carta)=> !carta.adivinada).length===0){
			alert('GANASTE')
		}
	}

	reiniciar(){
		this.setState(
			this.estadoInicial()
		)
	}

	shuffleArray(array) {
		let i = array.length - 1;
		for (; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  const temp = array[i];
		  array[i] = array[j];
		  array[j] = temp;
		}
		return array;
	}

	
	render(){
		return(
			<div className='App'>
				<Header intentos={this.state.intentos} reiniciar={()=> this.reiniciar()}/>
				<Tablero baraja ={this.state.baraja} 
				pareja={this.state.pareja}
				seleccionarCarta={(carta)=> this.seleccionarCarta(carta)}
				/>
			</div>
		);
	}

}
class Carta extends React.Component{
	render(){
		return(
			<div on onClick={this.props.seleccionarCarta}>
				<FlipCard 
					flipped={this.props.comparando || this.props.adivinada}
					disabled={true}
				>
					<div className="abajo">
					</div>
					<div className='arriba'>
						<img src={baraja[this.props.img]}/>
					</div>
				</FlipCard>
			</div>
		);
	}
}



class Header extends React.Component{
    render(){
		return(
			<div>
				<header>
				<div className='titulo'>
					REACT Memoria
				</div>
				<div className='titulo'>
					Contador: {this.props.intentos}
				</div>
			</header>
			</div>
		);
	}
}

class Tablero extends React.Component{
	render(){
			return (
				<div className='tablero'>
					{
						this.props.baraja
						.map((carta, index)=> {
							const comparando = this.props.pareja.indexOf(carta)>-1;
							return <Carta 
							key={index}
							img={carta.img}
							comparando={comparando}
							seleccionarCarta= { ()=> this.props.seleccionarCarta(carta)}
							adivinada={carta.adivinada}/>
						})
					}
				</div>
			);
		}
	}
  
  ReactDOM.render( <App/>, document.getElementById('index'))