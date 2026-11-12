
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, Linking, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const LIGHT_C = { green:'#176B50', green2:'#21845F', mint:'#E5F3EB', blue:'#2474A8', paleBlue:'#E8F3FA', bg:'#F5F7F3', white:'#FFFFFF', text:'#1C2B23', muted:'#758179', border:'#E3EAE4', orange:'#E89A43', red:'#C94B4B', soft:'#F0F5EF' };
const DARK_C = { green:'#45B789', green2:'#55C79A', mint:'#213A30', blue:'#62B8E9', paleBlue:'#203743', bg:'#111A16', white:'#1B2822', text:'#EDF5F0', muted:'#A7B5AD', border:'#304239', orange:'#F2B15F', red:'#FF7777', soft:'#223129' };
let C = LIGHT_C;
const CATEGORIES = [
  { id:'protein', name:'Alto proteico', icon:'barbell-outline', color:'#E4F2E7' },
  { id:'lowcarb', name:'Low carb', icon:'leaf-outline', color:'#E9F4D8' },
  { id:'vegan', name:'Vegano', icon:'flower-outline', color:'#DDF2E8' },
  { id:'lactose', name:'Sem lactose', icon:'water-outline', color:'#E3F0FC' },
  { id:'balanced', name:'Equilibrado', icon:'restaurant-outline', color:'#F8EDDA' }
];
const MEALS = [
 {id:'m1',name:'Bowl de frango grelhado',category:'protein',type:'Alto proteico',description:'Frango suculento, arroz integral, brócolis e molho de ervas da casa.',price:29.90,calories:420,protein:38,carbs:42,fats:10,rating:4.9,time:'20–25 min',image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85',ingredients:['Frango grelhado','Arroz integral','Brócolis','Cenoura','Molho de ervas'],tags:['Mais pedido','Sem glúten']},
 {id:'m2',name:'Salmão & quinoa',category:'balanced',type:'Equilibrado',description:'Salmão assado, quinoa, folhas frescas e molho cítrico.',price:37.90,calories:465,protein:34,carbs:35,fats:18,rating:4.8,time:'25–30 min',image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=85',ingredients:['Salmão assado','Quinoa','Mix de folhas','Tomate-cereja','Molho cítrico'],tags:['Ômega 3','Mais pedido']},
 {id:'m3',name:'Salada power low carb',category:'lowcarb',type:'Low carb',description:'Mix de folhas, ovos, abacate, tomate-cereja e sementes.',price:25.90,calories:315,protein:21,carbs:16,fats:19,rating:4.7,time:'15–20 min',image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85',ingredients:['Mix de folhas','Ovos','Abacate','Tomate-cereja','Sementes'],tags:['Low carb','Sem glúten']},
 {id:'m4',name:'Bowl mediterrâneo vegano',category:'vegan',type:'Vegano',description:'Grão-de-bico temperado, batata-doce, homus e vegetais assados.',price:27.90,calories:390,protein:17,carbs:54,fats:11,rating:4.8,time:'20–25 min',image:'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1000&q=85',ingredients:['Grão-de-bico','Batata-doce','Homus','Abobrinha','Pimentão'],tags:['100% vegetal','Fibras']},
 {id:'m5',name:'Frango teriyaki fit',category:'protein',type:'Alto proteico',description:'Frango ao molho teriyaki leve, arroz negro e gergelim.',price:31.90,calories:448,protein:41,carbs:46,fats:9,rating:4.9,time:'20–25 min',image:'https://images.unsplash.com/photo-1512138415238-1e8a33f4e3d4?auto=format&fit=crop&w=1000&q=85',ingredients:['Frango','Arroz negro','Brócolis','Gergelim','Teriyaki leve'],tags:['Alta proteína','Favorito da casa']},
 {id:'m6',name:'Massa de abobrinha',category:'lowcarb',type:'Low carb',description:'Espaguete de abobrinha, bolonhesa magra e parmesão opcional.',price:26.90,calories:285,protein:27,carbs:13,fats:12,rating:4.6,time:'15–20 min',image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85',ingredients:['Abobrinha','Patinho moído','Tomate','Manjericão','Parmesão'],tags:['Low carb','Sem farinha']},
 {id:'m7',name:'Tofu crocante bowl',category:'vegan',type:'Vegano',description:'Tofu dourado, arroz integral, edamame e molho de amendoim.',price:28.90,calories:410,protein:23,carbs:47,fats:14,rating:4.7,time:'20–25 min',image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',ingredients:['Tofu','Arroz integral','Edamame','Pepino','Molho de amendoim'],tags:['100% vegetal','Proteína vegetal']},
 {id:'m8',name:'Wrap de frango leve',category:'lactose',type:'Sem lactose',description:'Wrap integral, frango desfiado, alface, cenoura e creme sem lactose.',price:22.90,calories:350,protein:29,carbs:39,fats:8,rating:4.6,time:'12–18 min',image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1000&q=85',ingredients:['Wrap integral','Frango desfiado','Alface','Cenoura','Creme sem lactose'],tags:['Sem lactose','Prático']}
];
const money = n => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;


const USERS_STORAGE_KEY = 'fitfood_registered_users_v1';
const emptyProfile = { name:'', email:'', phone:'', address:'', neighborhood:'', city:'' };
const normalizeEmail = email => String(email || '').trim().toLowerCase();
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));

const EMPTY_ADDRESS = { label:'Casa', cep:'', street:'', number:'', complement:'', neighborhood:'', city:'Presidente Epitácio - SP', reference:'' };
function getAccountAddresses(account) {
  if (Array.isArray(account?.addresses)) return account.addresses.filter(item => item && item.id);
  if (account?.address || account?.neighborhood || account?.city) {
    return [{ id:`address-${account.id || Date.now()}`, label:'Principal', street:String(account.address || ''), number:'', complement:'', neighborhood:String(account.neighborhood || ''), city:String(account.city || ''), reference:'', isDefault:true }];
  }
  return [];
}
function formatAddress(address) {
  if (!address) return '';
  const street = [address.street, address.number].filter(Boolean).join(', ');
  return [street, address.complement, address.neighborhood, address.city, address.cep ? `CEP: ${address.cep}` : '', address.reference ? `Referência: ${address.reference}` : ''].filter(Boolean).join(' · ');
}
function addressSignature(address) {
  return [address?.street, address?.number, address?.neighborhood, address?.city].map(value => String(value || '').trim().toLowerCase()).join('|');
}

function loadRegisteredUsers() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(account => account && typeof account.email === 'string' && typeof account.password === 'string');
  } catch (error) {
    console.warn('Não foi possível ler os cadastros locais do Fit & Food:', error);
    return [];
  }
}

function saveRegisteredUsers(users) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.warn('Não foi possível salvar os cadastros locais do Fit & Food:', error);
    return false;
  }
}

const MEAL_COMPONENTS = {
 m1:[
  {name:'Frango grelhado',calories:165,protein:31,carbs:0,fats:4,extraPrice:2},
  {name:'Arroz integral',calories:125,protein:3,carbs:26,fats:1,extraPrice:2},
  {name:'Brócolis',calories:35,protein:3,carbs:7,fats:0.4,extraPrice:1.5},
  {name:'Cenoura',calories:25,protein:0.5,carbs:6,fats:0.1,extraPrice:1.5},
  {name:'Molho de ervas',calories:70,protein:0.5,carbs:3,fats:4.5,extraPrice:1}
 ],
 m2:[
  {name:'Salmão assado',calories:220,protein:23,carbs:0,fats:14,extraPrice:5},
  {name:'Quinoa',calories:125,protein:4.5,carbs:22,fats:2,extraPrice:2},
  {name:'Mix de folhas',calories:15,protein:1,carbs:2,fats:0.2,extraPrice:1},
  {name:'Tomate-cereja',calories:25,protein:1,carbs:5,fats:0.2,extraPrice:1.5},
  {name:'Molho cítrico',calories:80,protein:4.5,carbs:6,fats:1.6,extraPrice:1}
 ],
 m3:[
  {name:'Mix de folhas',calories:25,protein:2,carbs:4,fats:0.4,extraPrice:1},
  {name:'Ovos',calories:140,protein:12,carbs:1,fats:10,extraPrice:2},
  {name:'Abacate',calories:95,protein:1,carbs:5,fats:8,extraPrice:2},
  {name:'Tomate-cereja',calories:25,protein:1,carbs:5,fats:0.2,extraPrice:1.5},
  {name:'Sementes',calories:30,protein:5,carbs:1,fats:0.4,extraPrice:2}
 ],
 m4:[
  {name:'Grão-de-bico',calories:150,protein:8,carbs:25,fats:2.4,extraPrice:2},
  {name:'Batata-doce',calories:110,protein:2,carbs:26,fats:0.1,extraPrice:2},
  {name:'Homus',calories:65,protein:2,carbs:4,fats:4.5,extraPrice:1.5},
  {name:'Abobrinha',calories:30,protein:2,carbs:5,fats:0.4,extraPrice:1.5},
  {name:'Pimentão',calories:35,protein:1,carbs:7,fats:0.2,extraPrice:1.5}
 ],
 m5:[
  {name:'Frango',calories:180,protein:33,carbs:0,fats:4,extraPrice:3},
  {name:'Arroz negro',calories:150,protein:4,carbs:32,fats:1,extraPrice:2},
  {name:'Brócolis',calories:35,protein:3,carbs:7,fats:0.4,extraPrice:1.5},
  {name:'Gergelim',calories:33,protein:1,carbs:1,fats:3,extraPrice:2},
  {name:'Teriyaki leve',calories:50,protein:0,carbs:6,fats:0.6,extraPrice:1}
 ],
 m6:[
  {name:'Abobrinha',calories:40,protein:2,carbs:7,fats:0.5,extraPrice:1.5},
  {name:'Patinho moído',calories:150,protein:22,carbs:0,fats:7,extraPrice:3},
  {name:'Tomate',calories:40,protein:1,carbs:6,fats:0.3,extraPrice:1.5},
  {name:'Manjericão',calories:5,protein:0,carbs:0,fats:0,extraPrice:1},
  {name:'Parmesão',calories:50,protein:2,carbs:0,fats:4.2,extraPrice:2}
 ],
 m7:[
  {name:'Tofu',calories:100,protein:12,carbs:2,fats:6,extraPrice:2.5},
  {name:'Arroz integral',calories:150,protein:4,carbs:32,fats:1,extraPrice:2},
  {name:'Edamame',calories:100,protein:6,carbs:8,fats:4,extraPrice:2.5},
  {name:'Pepino',calories:20,protein:1,carbs:4,fats:0.2,extraPrice:1},
  {name:'Molho de amendoim',calories:40,protein:0,carbs:1,fats:2.8,extraPrice:1.5}
 ],
 m8:[
  {name:'Wrap integral',calories:130,protein:4,carbs:24,fats:3,extraPrice:2},
  {name:'Frango desfiado',calories:100,protein:22,carbs:0,fats:2,extraPrice:3},
  {name:'Alface',calories:10,protein:1,carbs:2,fats:0,extraPrice:1},
  {name:'Cenoura',calories:25,protein:1,carbs:6,fats:0,extraPrice:1.5},
  {name:'Creme sem lactose',calories:85,protein:1,carbs:7,fats:3,extraPrice:1.5}
 ]
};

const OPTIONAL_COMPONENTS = {
 m1:[
  {name:'Ovo extra',calories:72,protein:6.3,carbs:0.4,fats:4.8,price:2},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2},
  {name:'Mix de sementes extra',calories:55,protein:2.5,carbs:2,fats:4.5,price:2}
 ],
 m2:[
  {name:'Salmão extra',calories:150,protein:16,carbs:0,fats:9,price:5},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2},
  {name:'Molho cítrico extra',calories:35,protein:0,carbs:4,fats:1,price:1}
 ],
 m3:[
  {name:'Ovo extra',calories:72,protein:6.3,carbs:0.4,fats:4.8,price:2},
  {name:'Grão-de-bico extra',calories:80,protein:4.3,carbs:13.5,fats:1.3,price:2},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2}
 ],
 m4:[
  {name:'Grão-de-bico extra',calories:80,protein:4.3,carbs:13.5,fats:1.3,price:2},
  {name:'Tofu extra',calories:80,protein:10,carbs:2,fats:5,price:2.5},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2}
 ],
 m5:[
  {name:'Frango extra',calories:110,protein:23,carbs:0,fats:2.5,price:3},
  {name:'Ovo extra',calories:72,protein:6.3,carbs:0.4,fats:4.8,price:2},
  {name:'Brócolis extra',calories:20,protein:2,carbs:4,fats:0.2,price:1.5}
 ],
 m6:[
  {name:'Patinho extra',calories:100,protein:15,carbs:0,fats:5,price:3},
  {name:'Parmesão extra',calories:40,protein:4,carbs:0,fats:3.3,price:2},
  {name:'Abobrinha extra',calories:20,protein:1,carbs:3,fats:0.3,price:1.5}
 ],
 m7:[
  {name:'Tofu extra',calories:80,protein:10,carbs:2,fats:5,price:2.5},
  {name:'Edamame extra',calories:60,protein:6,carbs:5,fats:2.4,price:2.5},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2}
 ],
 m8:[
  {name:'Frango extra',calories:110,protein:23,carbs:0,fats:2.5,price:3},
  {name:'Ovo extra',calories:72,protein:6.3,carbs:0.4,fats:4.8,price:2},
  {name:'Abacate extra',calories:80,protein:1,carbs:4.3,fats:7.4,price:2}
 ]
};

function getBaseComponents(meal) {
 const data = MEAL_COMPONENTS[meal.id];
 if (data) return data.map(c => ({...c, defaultQuantity:1, optional:false}));
 const names = Array.isArray(meal.ingredients) && meal.ingredients.length ? meal.ingredients : ['Porção base da refeição'];
 if (names.length === 1) return [{name:names[0], calories:Number(meal.calories)||0, protein:Number(meal.protein)||0, carbs:Number(meal.carbs)||0, fats:Number(meal.fats)||0, extraPrice:2, defaultQuantity:1, optional:false}];
 const divisor = names.length || 1;
 return names.map((name,index) => ({name,calories:index===0?(Number(meal.calories)||0):0,protein:index===0?(Number(meal.protein)||0):0,carbs:index===0?(Number(meal.carbs)||0):0,fats:index===0?(Number(meal.fats)||0):0,extraPrice:2,defaultQuantity:1,optional:false}));
}
function getOptionalComponents(meal) {
 const baseNames = getBaseComponents(meal).map(c=>c.name.toLowerCase());
 return (OPTIONAL_COMPONENTS[meal.id] || []).filter(c=>!baseNames.includes(c.name.toLowerCase())).map(c=>({...c,extraPrice:c.price,defaultQuantity:0,optional:true}));
}
function getAllComponents(meal) { return [...getBaseComponents(meal), ...getOptionalComponents(meal)]; }
function getDefaultIngredientQuantities(meal) {
 return Object.fromEntries(getAllComponents(meal).map(c=>[c.name,c.defaultQuantity]));
}
function calculateNutrition(meal, quantities) {
 const total = getAllComponents(meal).reduce((acc,c)=>{
  const raw = quantities && quantities[c.name] !== undefined ? quantities[c.name] : c.defaultQuantity;
  const qty = Math.max(0, Number(raw)||0);
  acc.calories += c.calories*qty; acc.protein += c.protein*qty; acc.carbs += c.carbs*qty; acc.fats += c.fats*qty;
  return acc;
 },{calories:0,protein:0,carbs:0,fats:0});
 return {calories:Math.round(total.calories),protein:Math.round(total.protein*10)/10,carbs:Math.round(total.carbs*10)/10,fats:Math.round(total.fats*10)/10};
}
function calculateMealPrice(meal, quantities, size='Padrão') {
 let total = Number(meal.price)||0;
 if (size==='Grande') total+=6;
 getAllComponents(meal).forEach(c=>{
  const qty = Math.max(0,Number(quantities && quantities[c.name] !== undefined ? quantities[c.name] : c.defaultQuantity)||0);
  if (c.optional) total += qty*(c.price || c.extraPrice || 0);
  else total += Math.max(0,qty-c.defaultQuantity)*(c.extraPrice || 0);
 });
 return Math.round(total*100)/100;
}

function showAlert(title, message, buttons) {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length) {
      const accepted = window.confirm([title, message].filter(Boolean).join('\n\n'));
      const action = accepted
        ? (buttons.find(button => button.style === 'destructive') || buttons[buttons.length - 1])
        : buttons.find(button => button.style === 'cancel');
      if (action && typeof action.onPress === 'function') action.onPress();
      return;
    }
    window.alert([title, message].filter(Boolean).join('\n\n'));
    return;
  }
  Alert.alert(title, message, buttons);
}

function Button({title,onPress,secondary=false,disabled=false,icon,style={}}) { return <TouchableOpacity activeOpacity={0.82} disabled={disabled} onPress={onPress} style={[{backgroundColor:secondary?C.white:C.green,borderColor:secondary?C.border:C.green,borderWidth:1,borderRadius:15,minHeight:49,alignItems:'center',justifyContent:'center',flexDirection:'row',paddingHorizontal:16,opacity:disabled?.5:1},style]}>{icon?<Ionicons name={icon} size={18} color={secondary?C.green:C.white} style={{marginRight:8}}/>:null}<Text style={{color:secondary?C.green:C.white,fontWeight:'800',fontSize:14}}>{title}</Text></TouchableOpacity> }
function Field({label,value,onChangeText,placeholder,secureTextEntry,keyboardType,multiline,editable=true}) { return <View style={{marginBottom:14}}><Text style={S.label}>{label}</Text><TextInput value={value} onChangeText={editable?onChangeText:undefined} editable={editable} placeholder={placeholder||label} placeholderTextColor="#9AA49D" secureTextEntry={secureTextEntry} keyboardType={keyboardType||'default'} multiline={multiline} style={[S.input,!editable&&{backgroundColor:C.soft,color:C.muted,borderColor:C.border},multiline&&{height:94,textAlignVertical:'top',paddingTop:13}]}/></View> }
function Header({title,onBack,right}) { return <View style={S.header}>{onBack?<TouchableOpacity onPress={onBack} style={S.headerIcon}><Ionicons name="arrow-back" size={22} color={C.text}/></TouchableOpacity>:<View style={S.headerIcon}><Ionicons name="leaf-outline" size={24} color={C.green}/></View>}<Text style={S.headerTitle}>{title}</Text>{right||<View style={{width:42}}/>}</View> }
function MealCard({meal,onPress,favorite,onFavorite,cardWidth='48.5%',columns=2}) {
  const nutrition = calculateNutrition(meal, getDefaultIngredientQuantities(meal));
  return <View style={[S.mealCard,{width:cardWidth}]}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
      <Image source={{uri:meal.image}} style={[S.mealImage,{height:columns>=3?138:122}]}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={onFavorite} style={S.heart} accessibilityLabel={favorite?'Remover dos favoritos':'Adicionar aos favoritos'}>
      <Ionicons name={favorite?'heart':'heart-outline'} size={20} color={favorite?C.red:C.green}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress} style={{padding:10}} activeOpacity={0.88}>
      <Text style={S.mealName} numberOfLines={2}>{meal.name}</Text>
      <Text style={S.muted} numberOfLines={2}>{meal.description}</Text>
      <Text style={{fontWeight:'900',fontSize:16,color:C.green,marginTop:9}}>{money(meal.price)}</Text>
      <View style={{flexDirection:'row',alignItems:'center',gap:4,marginTop:5}}>
        <Ionicons name="star" size={13} color={C.orange}/>
        <Text style={[S.muted,{fontSize:11}]}>{meal.rating}</Text>
        <Text style={[S.muted,{fontSize:11}]} numberOfLines={1}>· {meal.time}</Text>
      </View>
      <View style={{flexDirection:'row',gap:4,marginTop:8,flexWrap:'wrap'}}>
        <Pill>{nutrition.calories} kcal</Pill><Pill>{Math.round(nutrition.protein)}g proteína</Pill>
      </View>
    </TouchableOpacity>
  </View>;
}
function Pill({children,active=false,onPress}) { return <TouchableOpacity disabled={!onPress} onPress={onPress} style={{backgroundColor:active?C.green:C.mint,paddingHorizontal:10,paddingVertical:7,borderRadius:20,marginRight:5,marginBottom:5}}><Text style={{fontSize:12,fontWeight:'700',color:active?C.white:C.green}}>{children}</Text></TouchableOpacity> }
function SectionTitle({title,action,onAction}) { return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:22,marginBottom:12}}><Text style={S.sectionTitle}>{title}</Text>{action?<TouchableOpacity onPress={onAction}><Text style={{color:C.green,fontWeight:'800'}}>{action}</Text></TouchableOpacity>:null}</View> }

function AppContent() {
 const { width: windowWidth } = useWindowDimensions();
 const [darkMode,setDarkMode] = useState(false);
 const gridColumns = windowWidth >= 900 ? 3 : 2;
 const gridCardWidth = gridColumns === 3 ? '31.8%' : '48.5%';
 const toggleTheme = () => { const next = !darkMode; C = next ? DARK_C : LIGHT_C; setDarkMode(next); };
 const [screen,setScreen]=useState('Login'); const [tab,setTab]=useState('Início');
 const [users,setUsers]=useState(loadRegisteredUsers);
 const [user,setUser]=useState(null);
 const [loginEmail,setLoginEmail]=useState(''); const [loginPass,setLoginPass]=useState(''); const [loginError,setLoginError]=useState(null); const [reg,setReg]=useState({name:'',email:'',phone:'',password:''});
 const [meals,setMeals]=useState(MEALS); const [favorites,setFavorites]=useState([]); const [query,setQuery]=useState(''); const [category,setCategory]=useState('all'); const [sort,setSort]=useState('recommended'); const [onlyProtein,setOnlyProtein]=useState(false);
 const [selected,setSelected]=useState(MEALS[0]); const [ingredientQuantities,setIngredientQuantities]=useState(()=>getDefaultIngredientQuantities(MEALS[0])); const [size,setSize]=useState('Padrão'); const [quantity,setQuantity]=useState(1); const [notes,setNotes]=useState('');
 const [cart,setCart]=useState([]); const [deliveryMode,setDeliveryMode]=useState('Entrega'); const [payment,setPayment]=useState('Pix'); const [address,setAddress]=useState(''); const [neighborhood,setNeighborhood]=useState(''); const [city,setCity]=useState(''); const [orders,setOrders]=useState([]);
 const [addresses,setAddresses]=useState([]); const [selectedAddressId,setSelectedAddressId]=useState(''); const [addressForm,setAddressForm]=useState(EMPTY_ADDRESS); const [editingAddressId,setEditingAddressId]=useState(null); const [addressReturnScreen,setAddressReturnScreen]=useState('Perfil'); const [addressFormReturnScreen,setAddressFormReturnScreen]=useState('Endereços');
 const [activeOrder,setActiveOrder]=useState(null); const [cepLoading,setCepLoading]=useState(false); const [cepMessage,setCepMessage]=useState(''); const [mapQuery,setMapQuery]=useState('Presidente Epitácio, SP'); const [mapSelection,setMapSelection]=useState(null); const mapFrameRef=useRef(null); const [rating,setRating]=useState(5); const [review,setReview]=useState(''); const [profileForm,setProfileForm]=useState(emptyProfile); const [newMeal,setNewMeal]=useState({name:'',description:'',price:'',calories:'',protein:'',category:'protein'}); const [plan,setPlan]=useState({days:['Segunda','Quarta','Sexta'],meals:['Almoço','Jantar']}); const [toast,setToast]=useState('');
 const cartCount=cart.reduce((sum,item)=>sum+item.quantity,0); const subtotal=cart.reduce((sum,item)=>sum+item.quantity*item.price,0); const freight=deliveryMode==='Entrega'?(subtotal>=60?0:5.9):0;
 const filtered=useMemo(()=>{let arr=meals.filter(m=>{const n=calculateNutrition(m,getDefaultIngredientQuantities(m));return (category==='all'||m.category===category)&&(!onlyProtein||n.protein>=30)&&(m.name+' '+m.description+' '+m.type+' '+(m.ingredients||[]).join(' ')).toLowerCase().includes(query.toLowerCase())}); if(sort==='price')arr.sort((a,b)=>a.price-b.price);if(sort==='protein')arr.sort((a,b)=>calculateNutrition(b,getDefaultIngredientQuantities(b)).protein-calculateNutrition(a,getDefaultIngredientQuantities(a)).protein);if(sort==='calories')arr.sort((a,b)=>calculateNutrition(a,getDefaultIngredientQuantities(a)).calories-calculateNutrition(b,getDefaultIngredientQuantities(b)).calories);return arr;},[meals,category,onlyProtein,query,sort]);
 const notify=msg=>{setToast(msg);setTimeout(()=>setToast(''),2300)};
 useEffect(()=>{
  if(Platform.OS!=='web'||typeof window==='undefined') return;
  const receiveMapPoint=event=>{
   if(mapFrameRef.current&&event.source!==mapFrameRef.current.contentWindow) return;
   const data=event.data;
   if(!data||data.type!=='FITFOOD_MAP_POINT'||!data.point) return;
   setMapSelection(data.point);
  };
  window.addEventListener('message',receiveMapPoint);
  return ()=>window.removeEventListener('message',receiveMapPoint);
 },[]);
 const useSelectedMapPoint=()=>{
  if(!mapSelection) return;
  const a=mapSelection.address||{};
  const cityName=a.city||a.town||a.village||a.municipality||a.county||'Presidente Epitácio';
  const state=a.state||a['ISO3166-2-lvl4']||a.state_code||'SP';
  const normalizeGeoText=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  const cityKey=normalizeGeoText(cityName);
  const stateKey=normalizeGeoText(state).toUpperCase();
  const isSaoPaulo=stateKey==='SP'||stateKey==='BR-SP'||stateKey==='SAO PAULO';
  const isPresidenteEpitacio=cityKey.includes('presidente epitacio');
  if(!isPresidenteEpitacio||!isSaoPaulo){showAlert('Local fora da área atendida',`O ponto selecionado foi identificado como ${cityName} - ${state}. Selecione um endereço dentro de Presidente Epitácio - SP.`);return;}
  const street=a.road||a.pedestrian||a.residential||a.footway||'';
  const neighborhood=a.suburb||a.neighbourhood||a.quarter||a.city_district||'';
  setAddressForm(prev=>({...prev,street:street||prev.street,neighborhood:neighborhood||prev.neighborhood,city:'Presidente Epitácio - SP',cep:a.postcode||prev.cep.replace(/\D/g,'')}));
  setCepMessage('Local selecionado no mapa. Confira o endereço e informe o número do imóvel antes de salvar.');
  setScreen('Editar endereço');
 };

 const persistUserUpdates=updates=>{
  if(!user) return null;
  const updatedAccount={...user,...updates};
  const updatedUsers=users.map(item=>item.id===user.id?updatedAccount:item);
  setUsers(updatedUsers);
  setUser(updatedAccount);
  const saved=saveRegisteredUsers(updatedUsers);
  if(!saved) showAlert('Dados não persistidos','O navegador não permitiu salvar estas informações. Elas podem ser perdidas ao atualizar ou fechar a página. Verifique as permissões de armazenamento.');
  return updatedAccount;
 };
 const saveAddressBook=nextAddresses=>{
  const normalized=nextAddresses.map(item=>({...item,isDefault:!!item.isDefault}));
  if(normalized.length && !normalized.some(item=>item.isDefault)) normalized[0].isDefault=true;
  const defaultAddress=normalized.find(item=>item.isDefault)||normalized[0]||null;
  setAddresses(normalized);
  if(!normalized.some(item=>item.id===selectedAddressId)) setSelectedAddressId(defaultAddress?.id||'');
  persistUserUpdates({addresses:normalized,address:defaultAddress?.street||'',neighborhood:defaultAddress?.neighborhood||'',city:defaultAddress?.city||''});
 };
 const beginNewAddress=(returnTo='Endereços')=>{setAddressFormReturnScreen(returnTo);setEditingAddressId(null);setAddressForm({...EMPTY_ADDRESS});setScreen('Editar endereço')};
 const beginEditAddress=item=>{setAddressFormReturnScreen('Endereços');setEditingAddressId(item.id);setAddressForm({label:item.label||'Outro',cep:item.cep||'',street:item.street||'',number:item.number||'',complement:item.complement||'',neighborhood:item.neighborhood||'',city:item.city||'',reference:item.reference||''});setCepMessage('');setScreen('Editar endereço')};
 const saveAddress=()=>{
  const clean={label:String(addressForm.label||'').trim()||'Outro',cep:String(addressForm.cep||'').replace(/\D/g,''),street:String(addressForm.street||'').trim(),number:String(addressForm.number||'').trim(),complement:String(addressForm.complement||'').trim(),neighborhood:String(addressForm.neighborhood||'').trim(),city:String(addressForm.city||'').trim(),reference:String(addressForm.reference||'').trim()};
  if(!clean.cep || clean.cep.length!==8){showAlert('CEP obrigatório','Informe um CEP válido com 8 números e consulte-o antes de salvar.');return;}
  if(!clean.street||!clean.number||!clean.neighborhood||!clean.city){showAlert('Dados incompletos','Preencha rua/avenida, número, bairro e cidade/UF para salvar o endereço.');return;}
  if(clean.city.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().indexOf('presidente epitacio')===-1){showAlert('Área de entrega não atendida','Por enquanto, os endereços do Fit & Food devem estar em Presidente Epitácio - SP.');return;}
  const signature=addressSignature(clean);
  if(addresses.some(item=>item.id!==editingAddressId&&addressSignature(item)===signature)){showAlert('Endereço já cadastrado','Este endereço já está salvo na sua lista. Selecione-o em vez de cadastrá-lo novamente.');return;}
  const current=addresses.find(item=>item.id===editingAddressId);
  const entry={...clean,id:editingAddressId||`address-${Date.now()}`,isDefault:current?!!current.isDefault:addresses.length===0};
  const next=editingAddressId?addresses.map(item=>item.id===editingAddressId?entry:item):[...addresses,entry];
  saveAddressBook(next);
  setSelectedAddressId(entry.id);
  setAddressForm({...EMPTY_ADDRESS});setEditingAddressId(null);setScreen(addressFormReturnScreen);notify(editingAddressId?'Endereço atualizado':'Endereço salvo com sucesso');
 };
 const setDefaultAddress=id=>{saveAddressBook(addresses.map(item=>({...item,isDefault:item.id===id})));notify('Endereço principal atualizado')};
 const deleteAddress=id=>{
  const target=addresses.find(item=>item.id===id);
  if(!target)return;
  showAlert('Excluir endereço',`Deseja remover “${target.label}” da sua lista de endereços?`,[{text:'Cancelar',style:'cancel'},{text:'Excluir',style:'destructive',onPress:()=>{const next=addresses.filter(item=>item.id!==id);if(target.isDefault&&next.length)next[0]={...next[0],isDefault:true};saveAddressBook(next);notify('Endereço removido')}}]);
 };
 const selectedAddress=addresses.find(item=>item.id===selectedAddressId)||addresses.find(item=>item.isDefault)||addresses[0]||null;
 const lookupCep=async()=>{
  const cep=String(addressForm.cep||'').replace(/\D/g,'');
  if(cep.length!==8){setCepMessage('Digite um CEP com 8 números.');return;}
  setCepLoading(true);setCepMessage('Consultando CEP...');
  try{
   const response=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
   if(!response.ok) throw new Error('O serviço de CEP não respondeu corretamente.');
   const data=await response.json();
   if(data.erro){setCepMessage('CEP não encontrado. Confira os números e tente novamente.');return;}
   const cityName=String(data.localidade||'');const state=String(data.uf||'');
   const normalized=cityName.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
   if(normalized!=='presidente epitacio'||state!=='SP'){setCepMessage(`Este CEP pertence a ${cityName || 'outra localidade'} - ${state || 'UF'}. O atendimento está limitado a Presidente Epitácio - SP.`);return;}
   setAddressForm(prev=>({...prev,cep:`${cep.slice(0,5)}-${cep.slice(5)}`,street:data.logradouro||prev.street,neighborhood:data.bairro||prev.neighborhood,city:`${cityName} - ${state}`}));
   setCepMessage(data.bairro?`Endereço encontrado: ${data.bairro}. Confira o número e o complemento.`:'CEP encontrado. O serviço não retornou o bairro; preencha-o manualmente.');
  }catch(error){console.error('Erro ao consultar CEP:',error);setCepMessage('Não foi possível consultar o CEP agora. Verifique sua conexão ou preencha o endereço manualmente.');}
  finally{setCepLoading(false);}
 };
 const openAddressMap=(item)=>{const query=typeof item==='string'?item:formatAddress(item);setMapQuery(query?`${query}, Presidente Epitácio, SP`:'Presidente Epitácio, SP');setScreen('Mapa')};
 const openExternalMap=()=>{const url=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;Linking.openURL(url).catch(()=>showAlert('Não foi possível abrir o mapa','Verifique se há um navegador ou aplicativo de mapas disponível no dispositivo.'));};
 const toggleFavorite=id=>setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 const openMeal=meal=>{setSelected(meal);setIngredientQuantities(getDefaultIngredientQuantities(meal));setSize('Padrão');setQuantity(1);setNotes('');setScreen('Detalhes')};
 const changeIngredientQuantity=(name,delta)=>setIngredientQuantities(prev=>({...prev,[name]:Math.max(0,Math.min(5,(Number(prev[name])||0)+delta))}));
 const selectedNutrition=calculateNutrition(selected,ingredientQuantities);
 const selectedUnitPrice=calculateMealPrice(selected,ingredientQuantities,size);
 const addToCart=()=>{const nutrition=calculateNutrition(selected,ingredientQuantities);const price=calculateMealPrice(selected,ingredientQuantities,size);const item={key:`${selected.id}-${Date.now()}`,meal:selected,mealId:selected.id,name:selected.name,price,quantity,size,ingredientQuantities:{...ingredientQuantities},nutrition,notes};setCart(prev=>[...prev,item]);setScreen('Main');setTab('Cardápio');notify('Refeição adicionada ao carrinho')};
 const updateQty=(key,delta)=>setCart(prev=>prev.map(i=>i.key===key?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0));
 const goTab=name=>{setTab(name);setScreen('Main')};
 const finishOrder=()=>{
  if(!cart.length){showAlert('Carrinho vazio','Adicione uma refeição antes de finalizar.');return;}
  if(deliveryMode==='Entrega'&&!selectedAddress){showAlert('Endereço necessário','Cadastre ou selecione um endereço salvo antes de confirmar a entrega.');setScreen('Entrega');return;}
  const cartSnapshot=cart.map((item,index)=>({...item,key:`${item.key||item.mealId||'item'}-${index}`,meal:{...item.meal},ingredientQuantities:{...(item.ingredientQuantities||{})},nutrition:{...(item.nutrition||calculateNutrition(item.meal,item.ingredientQuantities))},quantity:Math.max(1,Number(item.quantity)||1)}));
  const order={id:`FF-${Date.now().toString().slice(-6)}`,date:new Date().toLocaleString('pt-BR'),status:'Recebido',total:subtotal+freight,items:`${cartCount} item(ns)`,delivery:deliveryMode,payment,deliveryAddress:deliveryMode==='Entrega'&&selectedAddress?{...selectedAddress}:null,address:deliveryMode==='Entrega'?formatAddress(selectedAddress):'Retirada no balcão',cartItems:cartSnapshot,subtotal,freight};
  const nextOrders=[order,...orders];
  setOrders(nextOrders);persistUserUpdates({orders:nextOrders});setActiveOrder(order);setCart([]);setScreen('Pedido confirmado');
 };
 const repeatOrder=order=>{
  if(!Array.isArray(order?.cartItems)||!order.cartItems.length){showAlert('Não é possível repetir este pedido','Este pedido não possui o registro completo dos itens e das personalizações. Pedidos realizados a partir desta atualização terão todos os detalhes salvos para repetição.');return;}
  const applyRepeat=()=>{
   const copied=order.cartItems.map((item,index)=>({...item,key:`repeat-${Date.now()}-${index}`,meal:{...item.meal},ingredientQuantities:{...(item.ingredientQuantities||{})},nutrition:{...(item.nutrition||calculateNutrition(item.meal,item.ingredientQuantities))},quantity:Math.max(1,Number(item.quantity)||1)}));
   setCart(copied);setDeliveryMode(order.delivery==='Retirada'?'Retirada':'Entrega');setPayment(order.payment||'Pix');
   if(order.delivery==='Entrega'&&order.deliveryAddress){
    const snapshot=order.deliveryAddress;
    let existing=addresses.find(item=>item.id===snapshot.id)||addresses.find(item=>addressSignature(item)===addressSignature(snapshot));
    if(!existing){const restored={...snapshot,id:`address-${Date.now()}`,isDefault:addresses.length===0};const nextAddresses=[...addresses,restored];saveAddressBook(nextAddresses);existing=restored;}
    setSelectedAddressId(existing.id);
   } else if(addresses.length){setSelectedAddressId((addresses.find(item=>item.isDefault)||addresses[0]).id);}
   setScreen('Carrinho');notify('Pedido anterior restaurado com todas as personalizações');
  };
  if(cart.length){showAlert('Substituir carrinho atual?','Repetir este pedido substituirá os itens que já estão no seu carrinho.',[{text:'Manter carrinho',style:'cancel'},{text:'Substituir e repetir',style:'destructive',onPress:applyRepeat}]);return;}
  applyRepeat();
 };
 const startCheckout=()=>{if(!cart.length){showAlert('Carrinho vazio','Adicione itens do cardápio primeiro.');return;}setScreen('Entrega')};
 const login=()=>{
  const email=normalizeEmail(loginEmail);
  const password=String(loginPass || '');
  const rejectLogin=(title,message)=>{
   setLoginError({title,message});
   setScreen('Login');
   return false;
  };
  try {
   if(!email || !password) return rejectLogin('Preencha os campos','Informe seu e-mail e sua senha para entrar.');
   if(!isValidEmail(email)) return rejectLogin('E-mail inválido','Confira o endereço informado. Utilize um formato como nome@dominio.com.');
   const account=users.find(item=>normalizeEmail(item.email)===email);
   if(!account) return rejectLogin('Conta não encontrada',`Não existe um cadastro com o e-mail ${email}. Crie sua conta pela opção “Cadastre-se” antes de entrar.`);
   if(account.password!==password) return rejectLogin('Senha incorreta','A senha informada não confere com o cadastro. Verifique se digitou corretamente e tente novamente.');
   setLoginError(null);
   const accountAddresses=getAccountAddresses(account);
   const accountOrders=Array.isArray(account.orders)?account.orders:[];
   const hydratedAccount={...account,addresses:accountAddresses,orders:accountOrders};
   setUser(hydratedAccount);setProfileForm({...emptyProfile,...hydratedAccount});
   setAddresses(accountAddresses);setSelectedAddressId((accountAddresses.find(item=>item.isDefault)||accountAddresses[0])?.id||'');
   setOrders(accountOrders);setAddress(account.address||'');setNeighborhood(account.neighborhood||'');setCity(account.city||'');
   if(!Array.isArray(account.addresses)||!Array.isArray(account.orders)){const migratedUsers=users.map(item=>item.id===account.id?hydratedAccount:item);setUsers(migratedUsers);saveRegisteredUsers(migratedUsers);}
   setScreen('Main');setTab('Início');setCart([]);setFavorites([]);
  } catch(error) {
   console.error('Falha ao realizar login no Fit & Food:',error);
   rejectLogin('Não foi possível entrar','Ocorreu um erro inesperado durante a autenticação. Confira seus dados e tente novamente. Se o problema continuar, atualize o aplicativo ou entre em contato com o suporte.');
  }
 };
 const registerAccount=()=>{
  const name=String(reg.name||'').trim();
  const email=normalizeEmail(reg.email);
  const phone=String(reg.phone||'').trim();
  const password=String(reg.password||'');
  if(!name||!email||!password){showAlert('Campos obrigatórios','Preencha nome completo, e-mail e senha para criar sua conta.');return;}
  if(name.length<3){showAlert('Nome inválido','Informe seu nome com pelo menos 3 caracteres.');return;}
  if(!isValidEmail(email)){showAlert('E-mail inválido','Informe um e-mail válido, como nome@dominio.com.');return;}
  if(password.length<6){showAlert('Senha muito curta','Sua senha precisa ter pelo menos 6 caracteres.');return;}
  if(users.some(item=>normalizeEmail(item.email)===email)){showAlert('E-mail já cadastrado','Já existe uma conta vinculada a este e-mail. Volte à tela de login ou use outro endereço.');return;}
  const account={id:`user-${Date.now()}`,name,email,phone,address:'',neighborhood:'',city:'',addresses:[],orders:[],password,createdAt:new Date().toISOString()};
  const updatedUsers=[...users,account];
  setUsers(updatedUsers);
  const saved=saveRegisteredUsers(updatedUsers);
  setUser(account);setProfileForm({...emptyProfile,...account});setAddress('');setNeighborhood('');setCity('');
  setAddresses([]);setSelectedAddressId('');setOrders([]);setCart([]);setFavorites([]);setReg({name:'',email:'',phone:'',password:''});
  setScreen('Main');setTab('Início');
  if(!saved) {
   const detail=Platform.OS==='web'
    ? 'O navegador não permitiu salvar o cadastro neste dispositivo. Você entrou, mas a conta poderá ser perdida ao atualizar ou fechar a página. Verifique as permissões de armazenamento do navegador.'
    : 'O cadastro está ativo somente nesta sessão do aplicativo. Para mantê-lo após fechar o app, será necessário configurar armazenamento persistente ou conectar um back-end.';
   showAlert('Conta criada apenas nesta sessão',detail);
  } else notify('Cadastro concluído! Sua conta foi criada.');
 };
 const saveProfile=()=>{
  const name=String(profileForm.name||'').trim();
  if(!name){showAlert('Campo obrigatório','O nome completo não pode ficar vazio.');return;}
  const updatedAccount={...user,...profileForm,name,email:user.email,password:user.password,addresses:user.addresses||addresses,orders:user.orders||orders};
  const updatedUsers=users.map(item=>item.id===user.id?updatedAccount:item);
  setUsers(updatedUsers);
  const saved=saveRegisteredUsers(updatedUsers);
  setUser(updatedAccount);setProfileForm(updatedAccount);
  setAddress(updatedAccount.address||'');setNeighborhood(updatedAccount.neighborhood||'');setCity(updatedAccount.city||'');
  setScreen('Main');setTab('Perfil');
  if(!saved) {
   const detail=Platform.OS==='web'
    ? 'O navegador não permitiu salvar as alterações. Elas podem ser perdidas ao atualizar ou fechar a página.'
    : 'As alterações estão disponíveis somente nesta sessão. Para persistir no aplicativo instalado, configure armazenamento local ou um back-end.';
   showAlert('Alterações não persistidas',detail);
  } else notify('Dados atualizados com sucesso.');
 };
 const logout=()=>showAlert('Sair da conta','Deseja encerrar sua sessão? Os dados do cadastro continuarão salvos neste navegador.', [{text:'Cancelar',style:'cancel'},{text:'Sair',style:'destructive',onPress:()=>{setUser(null);setProfileForm(emptyProfile);setCart([]);setOrders([]);setAddresses([]);setSelectedAddressId('');setAddressForm({...EMPTY_ADDRESS});setEditingAddressId(null);setAddressReturnScreen('Perfil');setAddressFormReturnScreen('Endereços');setFavorites([]);setAddress('');setNeighborhood('');setCity('');setLoginEmail('');setLoginPass('');setLoginError(null);setScreen('Login');setTab('Início')}}]);
 const goBack=()=>{if(screen==='Endereços'){setScreen(addressReturnScreen);return;}if(screen==='Mapa'){setScreen('Editar endereço');return;}const map={'Cadastro':'Login','Detalhes':'Main','Carrinho':'Main','Entrega':'Carrinho','Pagamento':'Entrega','Pedido confirmado':'Main','Acompanhar pedido':'Main','Editar perfil':'Perfil','Editar endereço':'Endereços','Gerenciar cardápio':'Perfil','Avaliar pedido':'Pedidos','Contato':'Perfil','Plano semanal':'Main','Filtro':'Main'};setScreen(map[screen]||'Main')};
 const topRight=(icon,onPress,badge)=> <TouchableOpacity onPress={onPress} style={S.headerIcon}><Ionicons name={icon} size={22} color={C.text}/>{badge>0?<View style={S.badge}><Text style={{fontSize:10,color:C.white,fontWeight:'900'}}>{badge}</Text></View>:null}</TouchableOpacity>;
 const mealList=(list)=>list.length?<View style={S.mealGrid}>{list.map(m=><MealCard key={m.id} meal={m} columns={gridColumns} cardWidth={gridCardWidth} onPress={()=>openMeal(m)} favorite={favorites.includes(m.id)} onFavorite={()=>toggleFavorite(m.id)}/>)}</View>:<View style={S.empty}><Ionicons name="leaf-outline" size={34} color={C.green}/><Text style={S.sectionTitle}>Nenhuma refeição encontrada</Text><Text style={S.muted}>Tente mudar a categoria ou a busca.</Text></View>;
 const categoryChips=<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingVertical:4}}><Pill active={category==='all'} onPress={()=>setCategory('all')}>Todas</Pill>{CATEGORIES.map(c=><Pill key={c.id} active={category===c.id} onPress={()=>setCategory(c.id)}><Ionicons name={c.icon} size={12} color={category===c.id?C.white:C.green}/> {' '}{c.name}</Pill>)}</ScrollView>;

 const renderMain=()=>{
  if(tab==='Início')return <ScrollView contentContainerStyle={S.page}><View style={S.greeting}><View><Text style={S.muted}>BOM TE VER POR AQUI</Text><Text style={S.bigTitle}>Olá, {user.name.split(' ')[0]}!</Text><Text style={S.muted}>Sua próxima refeição saudável começa aqui.</Text></View><View style={S.avatar}><Ionicons name="person" size={24} color={C.green}/></View></View><TouchableOpacity style={S.hero} onPress={()=>setScreen('Plano semanal')}><View style={{flex:1}}><Text style={{color:'#D8F0DF',fontWeight:'800',fontSize:12}}>ROTINA MAIS LEVE</Text><Text style={{color:C.white,fontSize:23,fontWeight:'900',marginVertical:7}}>Seu plano fit da semana</Text><Text style={{color:'#E8F7EC',fontSize:13,marginBottom:13}}>Organize refeições e mantenha o foco.</Text><Text style={{color:C.white,fontWeight:'900'}}>Montar plano  →</Text></View><Ionicons name="leaf" size={54} color="#E4F5C8"/></TouchableOpacity><SectionTitle title="Explore por categoria" action="Ver cardápio" onAction={()=>goTab('Cardápio')}/><View style={S.categoryGrid}>{CATEGORIES.map(c=><TouchableOpacity key={c.id} onPress={()=>{setCategory(c.id);setTab('Cardápio')}} style={[S.categoryTile,{backgroundColor:darkMode?C.soft:c.color}]}><View style={{width:42,height:42,borderRadius:13,backgroundColor:darkMode?'#30483B':'rgba(255,255,255,0.72)',alignItems:'center',justifyContent:'center'}}><Ionicons name={c.icon} size={24} color={C.green}/></View><Text style={{fontWeight:'800',color:C.text,marginTop:8}}>{c.name}</Text></TouchableOpacity>)}</View><SectionTitle title="Mais pedidos" action="Ver todos" onAction={()=>goTab('Cardápio')}/>{mealList(meals.slice(0,3))}<SectionTitle title="Seu carrinho" action={`${cartCount} item(ns)`} onAction={()=>setScreen('Carrinho')}/><Button title="Abrir carrinho" icon="bag-handle-outline" onPress={()=>setScreen('Carrinho')} secondary/></ScrollView>;
  if(tab==='Cardápio')return <ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Nosso cardápio</Text><Text style={[S.muted,{marginBottom:15}]}>Comida de verdade, feita para seus objetivos.</Text><View style={S.search}><Ionicons name="search" size={20} color={C.muted}/><TextInput value={query} onChangeText={setQuery} placeholder="Buscar pratos e ingredientes" placeholderTextColor={C.muted} style={{flex:1,padding:8,color:C.text}}/><TouchableOpacity onPress={()=>setScreen('Filtro')}><Ionicons name="options-outline" size={22} color={C.green}/></TouchableOpacity></View>{categoryChips}<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:13,marginBottom:5}}><Text style={S.muted}>{filtered.length} opções encontradas</Text><TouchableOpacity onPress={()=>setSort(sort==='recommended'?'price':sort==='price'?'protein':sort==='protein'?'calories':'recommended')}><Text style={{color:C.green,fontWeight:'800'}}>Ordenar: {sort==='recommended'?'Destaques':sort==='price'?'Menor preço':sort==='protein'?'Proteína':'Menos kcal'} ↕</Text></TouchableOpacity></View>{mealList(filtered)}<Button title={`Ver carrinho (${cartCount})`} icon="bag-handle-outline" onPress={()=>setScreen('Carrinho')} style={{marginTop:12}}/></ScrollView>;
  if(tab==='Favoritos')return <ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Seus favoritos</Text><Text style={S.muted}>Refeições que você salvou para depois.</Text>{mealList(meals.filter(m=>favorites.includes(m.id)))}</ScrollView>;
  if(tab==='Pedidos')return <ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Meus pedidos</Text><Text style={S.muted}>Acompanhe seus pedidos e repita suas combinações favoritas.</Text>{orders.length?orders.map(o=><View key={o.id} style={S.orderCard}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={{fontWeight:'900',fontSize:16,color:C.text}}>{o.id}</Text><Pill active>{o.status}</Pill></View><Text style={[S.muted,{marginTop:8}]}>{o.date} · {o.items}</Text><Text style={{marginTop:8,color:C.text}}>{o.delivery} · {o.payment}</Text>{Array.isArray(o.cartItems)?o.cartItems.map((item,index)=><Text key={`${o.id}-${index}`} style={[S.muted,{fontSize:11,marginTop:5}]} numberOfLines={2}>• {item.quantity}× {item.name} — {item.size}; {getAllComponents(item.meal).filter(c=>Number(item.ingredientQuantities?.[c.name]??c.defaultQuantity)>0).map(c=>{const q=Number(item.ingredientQuantities?.[c.name]??c.defaultQuantity);return q>1?`${c.name} ×${q}`:c.name}).join(', ')}</Text>):null}<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:13}}><Text style={{fontWeight:'900',color:C.green,fontSize:16}}>{money(o.total)}</Text><TouchableOpacity onPress={()=>{setActiveOrder(o);setScreen('Acompanhar pedido')}}><Text style={{color:C.green,fontWeight:'800'}}>Ver pedido →</Text></TouchableOpacity></View><Button title={Array.isArray(o.cartItems)&&o.cartItems.length?'Repetir pedido':'Detalhes indisponíveis'} icon="refresh-outline" secondary disabled={!Array.isArray(o.cartItems)||!o.cartItems.length} onPress={()=>repeatOrder(o)} style={{marginTop:12}}/></View>):<View style={S.empty}><Ionicons name="receipt-outline" size={44} color={C.green}/><Text style={S.sectionTitle}>Você ainda não fez pedidos</Text><Text style={S.muted}>Quando finalizar uma compra, ela aparecerá aqui e poderá ser repetida com as mesmas personalizações.</Text><Button title="Explorar cardápio" onPress={()=>goTab('Cardápio')} style={{marginTop:16}}/></View>}</ScrollView>;
  return <ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Meu perfil</Text><View style={S.profileHead}><View style={[S.avatar,{width:64,height:64,borderRadius:32}]}><Ionicons name="person" size={30} color={C.green}/></View><View style={{flex:1,marginLeft:14}}><Text style={S.sectionTitle}>{user.name}</Text><Text style={S.muted}>{user.email}</Text></View></View><View style={S.menuBox}><MenuRow icon="person-outline" title="Editar dados pessoais" onPress={()=>{setProfileForm({...user});setScreen('Editar perfil')}}/><MenuRow icon="location-outline" title={`Meus endereços (${addresses.length})`} onPress={()=>{setAddressReturnScreen('Perfil');setScreen('Endereços')}}/><MenuRow icon="calendar-outline" title="Plano alimentar semanal" onPress={()=>setScreen('Plano semanal')}/><MenuRow icon="restaurant-outline" title="Cadastrar refeição no cardápio" onPress={()=>setScreen('Gerenciar cardápio')}/><MenuRow icon="chatbubble-ellipses-outline" title="Contato com o restaurante" onPress={()=>setScreen('Contato')}/><MenuRow icon="bag-handle-outline" title={`Carrinho (${cartCount})`} onPress={()=>setScreen('Carrinho')}/><MenuRow icon="log-out-outline" title="Sair da conta" onPress={logout} last/></View><Text style={[S.muted,{textAlign:'center',marginTop:20}]}>Fit & Food · Alimentação saudável, sem complicação.</Text></ScrollView>;
 };

 const renderScreen=()=>{
  if(screen==='Login')return <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={S.authPage}><ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center'}}><View style={S.logo}><Ionicons name="leaf" size={39} color={C.green}/></View><Text style={[S.bigTitle,{textAlign:'center',fontSize:32}]}>Fit <Text style={{color:C.green}}>& Food</Text></Text><Text style={[S.muted,{textAlign:'center',marginBottom:28}]}>Comer bem faz parte da sua melhor versão.</Text><View style={S.formCard}><Text style={S.sectionTitle}>Entre na sua conta</Text><Text style={[S.muted,{marginTop:5,marginBottom:20}]}>Use o e-mail e a senha cadastrados anteriormente.</Text>{loginError?<View accessibilityRole="alert" style={{backgroundColor:darkMode?'#3B2528':'#FFF0EF',borderWidth:1,borderColor:darkMode?'#704047':'#F1C9C6',borderRadius:14,padding:13,marginBottom:17}}><View style={{flexDirection:'row',alignItems:'center'}}><Ionicons name="alert-circle" size={21} color={C.red}/><Text style={{flex:1,marginLeft:8,fontSize:14,fontWeight:'900',color:C.red}}>{loginError.title}</Text><TouchableOpacity onPress={()=>setLoginError(null)} accessibilityLabel="Fechar mensagem de erro"><Ionicons name="close" size={19} color={C.muted}/></TouchableOpacity></View><Text style={{fontSize:13,lineHeight:19,color:C.text,marginTop:7}}>{loginError.message}</Text></View>:null}<Field label="E-mail" value={loginEmail} onChangeText={value=>{setLoginEmail(value);if(loginError)setLoginError(null);}} keyboardType="email-address"/><Field label="Senha" value={loginPass} onChangeText={value=>{setLoginPass(value);if(loginError)setLoginError(null);}} secureTextEntry/><Button title="Entrar" onPress={login} style={{marginTop:6}}/><TouchableOpacity onPress={()=>{setLoginError(null);setScreen('Cadastro')}} style={{padding:16,alignItems:'center'}}><Text style={{color:C.muted}}>Ainda não tem conta? <Text style={{color:C.green,fontWeight:'900'}}>Cadastre-se</Text></Text></TouchableOpacity><Text style={[S.muted,{fontSize:11,textAlign:'center'}]}>Somente contas cadastradas neste navegador podem entrar. Não utilize senhas reais neste protótipo.</Text></View></ScrollView></KeyboardAvoidingView>;
  if(screen==='Cadastro')return <><Header title="Criar conta" onBack={()=>setScreen('Login')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Vamos começar!</Text><Text style={S.muted}>Crie seu cadastro para fazer pedidos.</Text><View style={{marginTop:22}}><Field label="Nome completo" value={reg.name} onChangeText={v=>setReg({...reg,name:v})} placeholder="Seu nome completo"/><Field label="E-mail" value={reg.email} onChangeText={v=>setReg({...reg,email:v})} keyboardType="email-address" placeholder="nome@dominio.com"/><Field label="Telefone (opcional)" value={reg.phone} onChangeText={v=>setReg({...reg,phone:v})} keyboardType="phone-pad"/><Field label="Senha (mínimo 6 caracteres)" value={reg.password} onChangeText={v=>setReg({...reg,password:v})} secureTextEntry/><Text style={[S.muted,{fontSize:11,marginTop:-5,marginBottom:16}]}>O cadastro deste protótipo é armazenado localmente no navegador utilizado.</Text><Button title="Criar minha conta" onPress={registerAccount}/></View></ScrollView></>;
  if(screen==='Main')return <View style={{flex:1,backgroundColor:C.bg}}><View style={S.topbar}><View><Text style={{fontSize:19,fontWeight:'900',color:C.green}}>Fit & Food</Text><Text style={{fontSize:11,color:C.muted}}>Sua rotina mais saudável</Text></View><View style={{flexDirection:'row',alignItems:'center'}}><TouchableOpacity onPress={toggleTheme} style={S.themeToggle} accessibilityLabel={darkMode?'Ativar tema claro':'Ativar tema escuro'}><Ionicons name={darkMode?'sunny-outline':'moon-outline'} size={19} color={C.text}/>{windowWidth>520?<Text style={{fontSize:12,fontWeight:'800',color:C.text,marginLeft:7}}>{darkMode?'Tema claro':'Tema escuro'}</Text>:null}</TouchableOpacity>{topRight('bag-handle-outline',()=>setScreen('Carrinho'),cartCount)}</View></View><View style={{flex:1}}>{renderMain()}</View><View style={S.tabbar}>{[{name:'Início',icon:'home-outline'},{name:'Cardápio',icon:'restaurant-outline'},{name:'Favoritos',icon:'heart-outline'},{name:'Pedidos',icon:'receipt-outline'},{name:'Perfil',icon:'person-outline'}].map(t=><TouchableOpacity key={t.name} onPress={()=>goTab(t.name)} style={S.tabItem}><Ionicons name={t.icon} size={21} color={tab===t.name?C.green:'#95A199'}/><Text style={{fontSize:10,fontWeight:'800',color:tab===t.name?C.green:'#95A199',marginTop:3}}>{t.name}</Text></TouchableOpacity>)}</View></View>;
  if(screen==='Detalhes')return <><Header title="Detalhes da refeição" onBack={goBack} right={topRight('bag-handle-outline',()=>setScreen('Carrinho'),cartCount)}/><ScrollView contentContainerStyle={S.page}><Image source={{uri:selected.image}} style={S.detailImage}/><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:16}}><Text style={S.bigTitle}>{selected.name}</Text><TouchableOpacity onPress={()=>toggleFavorite(selected.id)}><Ionicons name={favorites.includes(selected.id)?'heart':'heart-outline'} size={26} color={C.red}/></TouchableOpacity></View><Text style={[S.muted,{marginTop:6}]}>{selected.description}</Text><View style={S.nutrition}>{[['flame-outline',selectedNutrition.calories,'kcal'],['fitness-outline',selectedNutrition.protein,'g proteína'],['nutrition-outline',selectedNutrition.carbs,'g carbo'],['water-outline',selectedNutrition.fats,'g gorduras']].map((n,i)=><View key={i} style={{alignItems:'center',flex:1}}><Ionicons name={n[0]} size={20} color={C.green}/><Text style={{fontSize:17,fontWeight:'900',color:C.text,marginTop:5}}>{n[1]}</Text><Text style={{fontSize:10,color:C.muted}}>{n[2]}</Text></View>)}</View><Text style={[S.muted,{marginTop:8,fontSize:11}]}>Valores nutricionais estimados e recalculados em tempo real por porção.</Text><SectionTitle title="Escolha o tamanho"/><View style={{flexDirection:'row'}}>{['Padrão','Grande'].map(v=><Pill key={v} active={size===v} onPress={()=>setSize(v)}>{v}{v==='Grande'?' (+R$ 6,00)':''}</Pill>)}</View><SectionTitle title="Monte sua refeição"/><Text style={S.muted}>Use − para retirar porções e + para adicionar. A nutrição e o preço são atualizados automaticamente.</Text>{getBaseComponents(selected).map(component=>{const qty=Number(ingredientQuantities[component.name] ?? component.defaultQuantity);return <View key={component.name} style={[S.optionCard,{padding:12,marginTop:8,opacity:qty===0?0.68:1}]}><View style={{flex:1,marginRight:8}}><Text style={S.mealName}>{component.name}</Text><Text style={S.muted}>{component.calories} kcal · {component.protein}g proteína por porção</Text><Text style={{fontSize:11,color:C.muted,marginTop:2}}>{qty===0?'Removido':`${qty} porção(ões)`}{qty>1?` · +${money(component.extraPrice*(qty-1))}`:''}</Text></View><View style={{flexDirection:'row',alignItems:'center',gap:9}}><TouchableOpacity accessibilityLabel={`Remover porção de ${component.name}`} onPress={()=>changeIngredientQuantity(component.name,-1)}><Ionicons name="remove-circle-outline" size={27} color={C.green}/></TouchableOpacity><Text style={{minWidth:14,textAlign:'center',fontWeight:'900',color:C.text}}>{qty}</Text><TouchableOpacity accessibilityLabel={`Adicionar porção de ${component.name}`} onPress={()=>changeIngredientQuantity(component.name,1)}><Ionicons name="add-circle" size={27} color={C.green}/></TouchableOpacity></View></View>})}{getOptionalComponents(selected).length? <><SectionTitle title="Adicionais"/>{getOptionalComponents(selected).map(component=>{const qty=Number(ingredientQuantities[component.name] ?? 0);return <View key={component.name} style={[S.optionCard,{padding:12,marginTop:8}]}><View style={{flex:1,marginRight:8}}><Text style={S.mealName}>{component.name}</Text><Text style={S.muted}>{component.calories} kcal · {component.protein}g proteína por porção</Text><Text style={{fontSize:11,color:C.muted,marginTop:2}}>{money(component.price)} por porção adicional</Text></View><View style={{flexDirection:'row',alignItems:'center',gap:9}}><TouchableOpacity accessibilityLabel={`Remover ${component.name}`} onPress={()=>changeIngredientQuantity(component.name,-1)}><Ionicons name="remove-circle-outline" size={27} color={C.green}/></TouchableOpacity><Text style={{minWidth:14,textAlign:'center',fontWeight:'900',color:C.text}}>{qty}</Text><TouchableOpacity accessibilityLabel={`Adicionar ${component.name}`} onPress={()=>changeIngredientQuantity(component.name,1)}><Ionicons name="add-circle" size={27} color={C.green}/></TouchableOpacity></View></View>})}</>:null}<SectionTitle title="Observações do pedido"/><Field label="Ex.: molho à parte, pouco sal..." value={notes} onChangeText={setNotes} multiline/><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:15}}><Text style={S.sectionTitle}>Quantidade</Text><View style={{flexDirection:'row',alignItems:'center',gap:18}}><TouchableOpacity onPress={()=>setQuantity(Math.max(1,quantity-1))}><Ionicons name="remove-circle-outline" size={30} color={C.green}/></TouchableOpacity><Text style={{fontSize:18,fontWeight:'900'}}>{quantity}</Text><TouchableOpacity onPress={()=>setQuantity(quantity+1)}><Ionicons name="add-circle" size={30} color={C.green}/></TouchableOpacity></View></View><Button title={`Adicionar · ${money(selectedUnitPrice*quantity)}`} onPress={addToCart}/></ScrollView></>;
  if(screen==='Carrinho')return <><Header title="Meu carrinho" onBack={goBack}/><ScrollView contentContainerStyle={S.page}>{!cart.length?<View style={S.empty}><Ionicons name="bag-handle-outline" size={48} color={C.green}/><Text style={S.sectionTitle}>Seu carrinho está vazio</Text><Text style={S.muted}>Escolha uma refeição saudável no cardápio.</Text><Button title="Explorar cardápio" onPress={()=>{goTab('Cardápio')}} style={{marginTop:18}}/></View>:<>{cart.map(i=><View key={i.key} style={S.cartRow}><Image source={{uri:i.meal.image}} style={{width:82,height:82,borderRadius:13}}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>{i.name}</Text><Text style={S.muted}>{i.size} · {getAllComponents(i.meal).filter(c=>Number(i.ingredientQuantities?.[c.name] ?? c.defaultQuantity)>0).map(c=>{const q=Number(i.ingredientQuantities?.[c.name] ?? c.defaultQuantity);return q>1?`${c.name} ×${q}`:c.name}).join(', ')}</Text><Text style={[S.muted,{fontSize:11,marginTop:4}]}>{(i.nutrition?.calories ?? calculateNutrition(i.meal,i.ingredientQuantities).calories)*i.quantity} kcal · {Math.round((i.nutrition?.protein ?? calculateNutrition(i.meal,i.ingredientQuantities).protein)*i.quantity*10)/10}g proteína no item</Text><Text style={{color:C.green,fontWeight:'900',marginTop:6}}>{money(i.price*i.quantity)}</Text><View style={{flexDirection:'row',alignItems:'center',marginTop:7,gap:12}}><TouchableOpacity onPress={()=>updateQty(i.key,-1)}><Ionicons name="remove-circle-outline" size={25} color={C.green}/></TouchableOpacity><Text style={{fontWeight:'900'}}>{i.quantity}</Text><TouchableOpacity onPress={()=>updateQty(i.key,1)}><Ionicons name="add-circle-outline" size={25} color={C.green}/></TouchableOpacity><TouchableOpacity onPress={()=>setCart(p=>p.filter(x=>x.key!==i.key))}><Ionicons name="trash-outline" size={20} color={C.red}/></TouchableOpacity></View></View></View>)}<View style={S.summary}><SummaryRow label="Subtotal" value={money(subtotal)}/><SummaryRow label="Frete estimado" value={deliveryMode==='Retirada'?'Grátis':subtotal>=60?'Grátis':money(5.9)}/><View style={S.line}/><SummaryRow label="Total parcial" value={money(subtotal+freight)} bold/></View><Button title="Continuar pedido" onPress={startCheckout}/><Button title="Continuar comprando" secondary onPress={()=>goTab('Cardápio')} style={{marginTop:10}}/></>}</ScrollView></>;
  if(screen==='Entrega')return <><Header title="Entrega ou retirada" onBack={()=>setScreen('Carrinho')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Como você quer receber?</Text><Text style={S.muted}>Escolha a opção mais conveniente.</Text>{['Entrega','Retirada'].map(v=><TouchableOpacity key={v} onPress={()=>setDeliveryMode(v)} style={[S.optionCard,deliveryMode===v&&S.optionSelected]}><Ionicons name={v==='Entrega'?'bicycle-outline':'storefront-outline'} size={26} color={C.green}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>{v==='Entrega'?'Receber em casa':'Retirar no restaurante'}</Text><Text style={S.muted}>{v==='Entrega'?(subtotal>=60?'Frete grátis para este pedido':'Frete estimado: R$ 5,90'):'Sem cobrança de frete'}</Text></View><Ionicons name={deliveryMode===v?'radio-button-on':'radio-button-off'} size={22} color={C.green}/></TouchableOpacity>)}{deliveryMode==='Entrega'?<View style={{marginTop:22}}><SectionTitle title="Selecione um endereço salvo" action="Gerenciar" onAction={()=>{setAddressReturnScreen('Entrega');setScreen('Endereços')}}/>{addresses.length?addresses.map(item=><TouchableOpacity key={item.id} onPress={()=>setSelectedAddressId(item.id)} style={[S.optionCard,(selectedAddress?.id===item.id)&&S.optionSelected]}><Ionicons name="location-outline" size={24} color={C.green}/><View style={{flex:1,marginLeft:11}}><View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}><Text style={S.mealName}>{item.label}</Text>{item.isDefault?<Pill active>Principal</Pill>:null}</View><Text style={S.muted}>{formatAddress(item)}</Text></View><Ionicons name={selectedAddress?.id===item.id?'radio-button-on':'radio-button-off'} size={22} color={C.green}/></TouchableOpacity>):<View style={S.empty}><Ionicons name="map-outline" size={38} color={C.green}/><Text style={S.sectionTitle}>Nenhum endereço cadastrado</Text><Text style={S.muted}>Salve seus endereços para selecioná-los rapidamente nos próximos pedidos.</Text></View>}<Button title="Adicionar endereço" icon="add" secondary onPress={()=>beginNewAddress('Entrega')} style={{marginTop:12}}/></View>:null}<View style={S.summary}><SummaryRow label="Subtotal" value={money(subtotal)}/><SummaryRow label="Frete" value={deliveryMode==='Retirada'?'Grátis':subtotal>=60?'Grátis':money(5.9)}/><View style={S.line}/><SummaryRow label="Total" value={money(subtotal+(deliveryMode==='Entrega'&&subtotal<60?5.9:0))} bold/></View><Button title="Escolher pagamento" onPress={()=>{if(deliveryMode==='Entrega'&&!selectedAddress){showAlert('Selecione um endereço','Cadastre um endereço ou selecione um endereço salvo para continuar.');return;}setScreen('Pagamento')}}/></ScrollView></>;
  if(screen==='Endereços')return <><Header title="Meus endereços" onBack={()=>setScreen(addressReturnScreen)}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Seus endereços</Text><Text style={S.muted}>Cadastre uma vez e escolha o endereço salvo sempre que pedir.</Text>{addresses.length?addresses.map(item=><View key={item.id} style={[S.optionCard,{alignItems:'flex-start'}]}><Ionicons name="location-outline" size={24} color={C.green} style={{marginTop:2}}/><View style={{flex:1,marginLeft:10}}><View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}><Text style={S.mealName}>{item.label}</Text>{item.isDefault?<Pill active>Principal</Pill>:null}</View><Text style={S.muted}>{formatAddress(item)}</Text><View style={{flexDirection:'row',flexWrap:'wrap',marginTop:12,gap:8}}>{!item.isDefault?<TouchableOpacity onPress={()=>setDefaultAddress(item.id)}><Text style={{color:C.green,fontWeight:'800',fontSize:12}}>Definir como principal</Text></TouchableOpacity>:null}<TouchableOpacity onPress={()=>openAddressMap(item)}><Text style={{color:C.green,fontWeight:'800',fontSize:12}}>Ver no mapa</Text></TouchableOpacity><TouchableOpacity onPress={()=>beginEditAddress(item)}><Text style={{color:C.blue,fontWeight:'800',fontSize:12}}>Editar</Text></TouchableOpacity><TouchableOpacity onPress={()=>deleteAddress(item.id)}><Text style={{color:C.red,fontWeight:'800',fontSize:12}}>Excluir</Text></TouchableOpacity></View></View></View>):<View style={S.empty}><Ionicons name="location-outline" size={42} color={C.green}/><Text style={S.sectionTitle}>Sua lista está vazia</Text><Text style={S.muted}>Adicione seu endereço residencial, de trabalho ou outro local frequente.</Text></View>}<Button title="Adicionar novo endereço" icon="add" onPress={beginNewAddress} style={{marginTop:18}}/></ScrollView></>;
  if(screen==='Editar endereço')return <><Header title={editingAddressId?'Editar endereço':'Novo endereço'} onBack={()=>setScreen(addressFormReturnScreen)}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>{editingAddressId?'Atualize o endereço':'Cadastre um endereço'}</Text><Text style={S.muted}>Informe o CEP para preencher automaticamente rua e bairro. O serviço valida se o endereço pertence a Presidente Epitácio - SP.</Text><View style={{marginTop:22}}><Text style={S.label}>Identificação</Text><View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:14}}>{['Casa','Trabalho','Outro'].map(label=><Pill key={label} active={addressForm.label===label} onPress={()=>setAddressForm(prev=>({...prev,label}))}>{label}</Pill>)}</View><Field label="CEP" value={addressForm.cep} onChangeText={v=>{const digits=v.replace(/\D/g,'').slice(0,8);setAddressForm(prev=>({...prev,cep:digits.length>5?`${digits.slice(0,5)}-${digits.slice(5)}`:digits}));setCepMessage('')}} placeholder="00000-000" keyboardType="numeric"/><Button title={cepLoading?'Consultando...':'Buscar CEP'} icon="search" secondary disabled={cepLoading} onPress={lookupCep} style={{marginTop:-5,marginBottom:12}}/>{cepMessage?<Text style={{color:cepMessage.startsWith('CEP encontrado')||cepMessage.startsWith('Endereço encontrado')?C.green:C.orange,fontSize:12,marginBottom:12}}>{cepMessage}</Text>:null}<Field label="Rua / Avenida" value={addressForm.street} onChangeText={v=>setAddressForm(prev=>({...prev,street:v}))} placeholder="Nome da rua ou avenida"/><Field label="Número" value={addressForm.number} onChangeText={v=>setAddressForm(prev=>({...prev,number:v}))} keyboardType="numeric"/><Field label="Complemento (opcional)" value={addressForm.complement} onChangeText={v=>setAddressForm(prev=>({...prev,complement:v}))} placeholder="Apto, bloco, casa..."/><Field label="Bairro" value={addressForm.neighborhood} onChangeText={v=>setAddressForm(prev=>({...prev,neighborhood:v}))}/><Field label="Cidade / UF" value={addressForm.city} onChangeText={v=>setAddressForm(prev=>({...prev,city:v}))} placeholder="Presidente Epitácio - SP"/><Field label="Ponto de referência (opcional)" value={addressForm.reference} onChangeText={v=>setAddressForm(prev=>({...prev,reference:v}))}/><Button title="Ver localização no mapa" icon="map-outline" secondary onPress={()=>openAddressMap({...addressForm,city:addressForm.city||'Presidente Epitácio - SP'})} style={{marginBottom:10}}/><Button title="Salvar endereço" onPress={saveAddress}/></View></ScrollView></>;
  if(screen==='Mapa'){
   const mapHtml=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>*{box-sizing:border-box}html,body,#map{height:100%;width:100%;margin:0;font-family:Arial,sans-serif}.search{position:absolute;z-index:1000;top:12px;left:12px;right:12px;display:flex;gap:6px;background:white;padding:8px;border-radius:10px;box-shadow:0 2px 12px #0003}.search input{min-width:0;flex:1;border:1px solid #ddd;border-radius:7px;padding:10px;font-size:14px}.search button{border:0;border-radius:7px;background:#176b50;color:white;padding:0 12px;font-weight:bold}.hint{position:absolute;z-index:900;bottom:12px;left:12px;right:12px;background:#fffE;padding:9px 12px;border-radius:9px;font-size:12px;color:#26352c;box-shadow:0 1px 8px #0002}.leaflet-popup-content{font-size:13px}</style></head><body><div id="map"></div><div class="search"><input id="q" placeholder="Buscar rua, bairro ou CEP"><button id="go">Buscar</button></div><div class="hint">Toque em qualquer ponto do mapa para marcar seu endereço. Os ícones mostram restaurantes, lanchonetes e cafés.</div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
document.getElementById('q').value=${JSON.stringify(mapQuery)};const center=[-21.765,-52.11];const map=L.map('map').setView(center,14);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);let selectedMarker=null;const poiLayer=L.layerGroup().addTo(map);
function sendPoint(point){parent.postMessage({type:'FITFOOD_MAP_POINT',point},'*')}
async function reverse(lat,lon){try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+lon+'&addressdetails=1&accept-language=pt-BR');if(!r.ok)throw new Error('reverse');const d=await r.json();sendPoint({lat,lon,displayName:d.display_name||'',address:d.address||{}});if(selectedMarker)selectedMarker.bindPopup((d.display_name||'Ponto selecionado')+'<br>Este ponto foi marcado para seu endereço.').openPopup()}catch(e){sendPoint({lat,lon,displayName:'Coordenadas selecionadas',address:{}});}}
map.on('click',e=>{const {lat,lng}=e.latlng;if(selectedMarker)map.removeLayer(selectedMarker);selectedMarker=L.marker([lat,lng]).addTo(map).bindPopup('Consultando endereço...').openPopup();reverse(lat,lng)});
async function loadPlaces(){try{const query='[out:json][timeout:20];(node[amenity~"restaurant|fast_food|cafe"](-21.81,-52.17,-21.72,-52.05);way[amenity~"restaurant|fast_food|cafe"](-21.81,-52.17,-21.72,-52.05);relation[amenity~"restaurant|fast_food|cafe"](-21.81,-52.17,-21.72,-52.05););out center tags;';const r=await fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(query));if(!r.ok)throw new Error('overpass');const d=await r.json();d.elements.forEach(p=>{const lat=p.lat||p.center?.lat,lon=p.lon||p.center?.lon;if(!lat||!lon)return;const name=p.tags?.name||'Estabelecimento sem nome';const type=p.tags?.amenity==='fast_food'?'Lanchonete':p.tags?.amenity==='cafe'?'Café':'Restaurante';L.marker([lat,lon]).addTo(poiLayer).bindPopup('<b>'+name.replace(/[<>&]/g,'')+'</b><br>'+type)});}catch(e){console.log('Não foi possível carregar pontos de interesse',e)}}loadPlaces();
async function search(){const q=document.getElementById('q').value.trim();if(!q)return;try{const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&country=Brazil&q='+encodeURIComponent(q+', Presidente Epitácio, SP'));const d=await r.json();if(d[0])map.setView([Number(d[0].lat),Number(d[0].lon)],17);else alert('Local não encontrado. Tente informar rua, bairro ou CEP.')}catch(e){alert('Não foi possível pesquisar o local agora.')}}document.getElementById('go').onclick=search;document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')search()});
</script></body></html>`;
   return <><Header title="Mapa de Presidente Epitácio" onBack={()=>setScreen('Editar endereço')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Escolha o ponto de entrega</Text><Text style={S.muted}>Mapa interativo da cidade. Pesquise um local, visualize estabelecimentos próximos ou toque diretamente no mapa para marcar o endereço.</Text>{Platform.OS==='web'?<View style={{height:490,borderRadius:16,overflow:'hidden',borderWidth:1,borderColor:C.border,marginTop:14}}>{React.createElement('iframe',{ref:mapFrameRef,title:'Mapa interativo de Presidente Epitácio',srcDoc:mapHtml,width:'100%',height:'100%',style:{border:0},allow:'geolocation'})}</View>:<View style={[S.summary,{alignItems:'center',marginTop:14}]}><Ionicons name="map-outline" size={42} color={C.green}/><Text style={S.mealName}>Mapa interativo disponível na versão web</Text><Text style={[S.muted,{textAlign:'center'}]}>Para incorporar este mesmo mapa no aplicativo Android/iOS, será necessário integrar um componente de mapa nativo ou WebView ao projeto Expo.</Text></View>}{mapSelection?<View style={[S.summary,{marginTop:14}]}><Text style={S.mealName}>Ponto selecionado</Text><Text style={S.muted}>{mapSelection.displayName||`${mapSelection.lat.toFixed(6)}, ${mapSelection.lon.toFixed(6)}`}</Text><Text style={[S.muted,{fontSize:11,marginTop:5}]}>Latitude: {mapSelection.lat.toFixed(6)} · Longitude: {mapSelection.lon.toFixed(6)}</Text><Button title="Usar este endereço" icon="checkmark-circle-outline" onPress={useSelectedMapPoint} style={{marginTop:12}}/></View>:<Text style={[S.muted,{fontSize:12,marginTop:12}]}>Depois de tocar no mapa, o endereço reconhecido aparecerá aqui para você confirmar.</Text>}<Text style={[S.muted,{fontSize:11,marginTop:12}]}>Mapa © OpenStreetMap · Estabelecimentos consultados no OpenStreetMap/Overpass · Endereço obtido por geocodificação reversa do Nominatim. A disponibilidade dos dados depende desses serviços.</Text></ScrollView></>;
  }
  if(screen==='Pagamento')return <><Header title="Forma de pagamento" onBack={()=>setScreen('Entrega')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Como deseja pagar?</Text><Text style={S.muted}>Selecione uma forma de pagamento para a demonstração.</Text>{[{name:'Pix',icon:'qr-code-outline',desc:'Confirmação simulada instantânea'},{name:'Cartão de crédito',icon:'card-outline',desc:'Crédito ou débito na entrega'},{name:'Vale-refeição',icon:'wallet-outline',desc:'Consulte a aceitação no restaurante'},{name:'Dinheiro',icon:'cash-outline',desc:'Pagamento na entrega/retirada'}].map(p=><TouchableOpacity key={p.name} onPress={()=>setPayment(p.name)} style={[S.optionCard,payment===p.name&&S.optionSelected]}><Ionicons name={p.icon} size={26} color={C.green}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>{p.name}</Text><Text style={S.muted}>{p.desc}</Text></View><Ionicons name={payment===p.name?'radio-button-on':'radio-button-off'} size={22} color={C.green}/></TouchableOpacity>)}<View style={S.summary}><SummaryRow label="Itens" value={money(subtotal)}/><SummaryRow label="Entrega" value={deliveryMode==='Retirada'?'Grátis':subtotal>=60?'Grátis':money(5.9)}/><View style={S.line}/><SummaryRow label="Total do pedido" value={money(subtotal+(deliveryMode==='Entrega'&&subtotal<60?5.9:0))} bold/></View><Button title="Confirmar pedido" onPress={finishOrder}/><Text style={[S.muted,{fontSize:11,textAlign:'center',marginTop:12}]}>Esta é uma simulação; nenhum pagamento real será processado.</Text></ScrollView></>;
  if(screen==='Pedido confirmado')return <ScrollView contentContainerStyle={[S.page,{flexGrow:1,justifyContent:'center'}]}><View style={S.successCircle}><Ionicons name="checkmark" size={52} color={C.white}/></View><Text style={[S.bigTitle,{textAlign:'center',marginTop:22}]}>Pedido confirmado!</Text><Text style={[S.muted,{textAlign:'center',marginTop:8}]}>Seu pedido {activeOrder?.id} foi recebido pelo Fit & Food.</Text><View style={S.summary}><SummaryRow label="Número do pedido" value={activeOrder?.id||'—'}/><SummaryRow label="Entrega" value={activeOrder?.delivery||deliveryMode}/><SummaryRow label="Pagamento" value={activeOrder?.payment||payment}/><View style={S.line}/><SummaryRow label="Total" value={money(activeOrder?.total)} bold/></View><Button title="Acompanhar pedido" onPress={()=>setScreen('Acompanhar pedido')}/><Button title="Voltar ao início" secondary onPress={()=>{setScreen('Main');setTab('Início')}} style={{marginTop:10}}/></ScrollView>;
  if(screen==='Acompanhar pedido')return <><Header title="Acompanhar pedido" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><View style={S.successCircle}><Ionicons name="bicycle" size={42} color={C.white}/></View><Text style={[S.bigTitle,{textAlign:'center',marginTop:18}]}>Estamos cuidando do seu pedido</Text><Text style={[S.muted,{textAlign:'center',marginTop:7}]}>{activeOrder?.id||orders[0]?.id} · Status demonstrativo</Text><View style={[S.summary,{marginTop:24}]}>{['Pedido recebido','Em preparo','Saiu para entrega','Entregue'].map((v,i)=><View key={v} style={{flexDirection:'row',alignItems:'center',paddingVertical:12}}><View style={{width:30,height:30,borderRadius:15,backgroundColor:i<2?C.green:C.mint,alignItems:'center',justifyContent:'center'}}><Ionicons name={i<2?'checkmark':'ellipse-outline'} size={16} color={i<2?C.white:C.green}/></View><View style={{marginLeft:12,flex:1}}><Text style={{fontWeight:'800',color:C.text}}>{v}</Text><Text style={S.muted}>{i===0?'Recebemos seu pedido':i===1?'O restaurante está preparando sua refeição':i===2?'Aguardando saída para entrega':'Bom apetite!'}</Text></View></View>)}</View><Button title="Entrar em contato" secondary onPress={()=>setScreen('Contato')}/><Button title="Voltar aos pedidos" onPress={()=>{setScreen('Main');setTab('Pedidos')}} style={{marginTop:10}}/></ScrollView></>;
  if(screen==='Editar perfil')return <><Header title="Dados pessoais" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Editar perfil</Text><Field label="Nome completo" value={profileForm.name} onChangeText={v=>setProfileForm({...profileForm,name:v})}/><Field label="E-mail" value={user.email} editable={false}/><Text style={[S.muted,{fontSize:11,marginTop:-7,marginBottom:13}]}>Este e-mail é utilizado para entrar na sua conta e não pode ser alterado após o cadastro.</Text><Field label="Telefone" value={profileForm.phone} onChangeText={v=>setProfileForm({...profileForm,phone:v})}/><View style={[S.optionCard,{marginBottom:16}]}><Ionicons name="location-outline" size={22} color={C.green}/><View style={{flex:1,marginLeft:10}}><Text style={S.mealName}>Endereços de entrega</Text><Text style={S.muted}>{addresses.length?`${addresses.length} endereço(s) salvo(s)`:'Nenhum endereço cadastrado'}</Text></View><TouchableOpacity onPress={()=>{setAddressReturnScreen('Editar perfil');setScreen('Endereços')}}><Text style={{color:C.green,fontWeight:'800'}}>Gerenciar</Text></TouchableOpacity></View><Button title="Salvar alterações" onPress={saveProfile}/></ScrollView></>;
  if(screen==='Gerenciar cardápio')return <><Header title="Gerenciar cardápio" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Cadastrar refeição</Text><Text style={S.muted}>Tela demonstrativa para cadastro local de pratos.</Text><Field label="Nome da refeição" value={newMeal.name} onChangeText={v=>setNewMeal({...newMeal,name:v})}/><Field label="Descrição" value={newMeal.description} onChangeText={v=>setNewMeal({...newMeal,description:v})} multiline/><Field label="Preço (ex.: 29.90)" value={newMeal.price} onChangeText={v=>setNewMeal({...newMeal,price:v})} keyboardType="decimal-pad"/><Field label="Calorias" value={newMeal.calories} onChangeText={v=>setNewMeal({...newMeal,calories:v})} keyboardType="number-pad"/><Field label="Proteínas (g)" value={newMeal.protein} onChangeText={v=>setNewMeal({...newMeal,protein:v})} keyboardType="number-pad"/><Text style={S.label}>Categoria</Text><View style={{flexDirection:'row',flexWrap:'wrap',marginVertical:10}}>{CATEGORIES.map(c=><Pill key={c.id} active={newMeal.category===c.id} onPress={()=>setNewMeal({...newMeal,category:c.id})}><Ionicons name={c.icon} size={12} color={newMeal.category===c.id?C.white:C.green}/> {' '}{c.name}</Pill>)}</View><Button title="Cadastrar refeição" onPress={()=>{if(!newMeal.name||!newMeal.price){showAlert('Campos obrigatórios','Informe nome e preço.');return;}const cat=CATEGORIES.find(c=>c.id===newMeal.category);const item={id:`custom-${Date.now()}`,name:newMeal.name,category:newMeal.category,type:cat.name,description:newMeal.description||'Refeição saudável do Fit & Food.',price:parseFloat(newMeal.price.replace(',','.'))||0,calories:Number(newMeal.calories)||0,protein:Number(newMeal.protein)||0,carbs:0,fats:0,rating:5,time:'20–25 min',image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85',ingredients:[],tags:['Novo']};setMeals(p=>[item,...p]);setNewMeal({name:'',description:'',price:'',calories:'',protein:'',category:'protein'});showAlert('Cadastro concluído','A refeição foi adicionada apenas a esta sessão.')}}/></ScrollView></>;
  if(screen==='Avaliar pedido')return <><Header title="Avaliar pedido" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Como foi sua experiência?</Text><Text style={S.muted}>Sua avaliação ajuda a melhorar o Fit & Food.</Text><View style={{flexDirection:'row',justifyContent:'center',gap:12,marginVertical:28}}>{[1,2,3,4,5].map(n=><TouchableOpacity key={n} onPress={()=>setRating(n)}><Ionicons name={n<=rating?'star':'star-outline'} size={36} color={C.orange}/></TouchableOpacity>)}</View><Text style={{textAlign:'center',fontWeight:'800',fontSize:17,marginBottom:20}}>{rating===5?'Excelente!':rating===4?'Muito bom!':rating===3?'Bom':rating===2?'Pode melhorar':'Ruim'}</Text><Field label="Comentário (opcional)" value={review} onChangeText={setReview} multiline placeholder="Conte como foi sua experiência..."/><Button title="Enviar avaliação" onPress={()=>{showAlert('Obrigado pela avaliação','Sua avaliação foi registrada nesta demonstração.');setReview('');setScreen('Main');setTab('Pedidos')}}/></ScrollView></>;
  if(screen==='Contato')return <><Header title="Fale conosco" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Estamos aqui para ajudar</Text><Text style={S.muted}>Escolha um canal para entrar em contato com o restaurante.</Text><View style={[S.optionCard,{marginTop:22}]}><Ionicons name="logo-whatsapp" size={28} color={C.green}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>WhatsApp</Text><Text style={S.muted}>(18) 3333-2020 · contato fictício</Text></View></View><View style={S.optionCard}><Ionicons name="mail-outline" size={28} color={C.green}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>E-mail</Text><Text style={S.muted}>contato@fitfood.example</Text></View></View><View style={S.optionCard}><Ionicons name="time-outline" size={28} color={C.green}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>Horário de atendimento</Text><Text style={S.muted}>Todos os dias, 10h às 22h</Text></View></View><Button title="Voltar ao perfil" onPress={()=>{setScreen('Main');setTab('Perfil')}} style={{marginTop:12}}/></ScrollView></>;
  if(screen==='Plano semanal')return <><Header title="Plano semanal" onBack={goBack}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Organize sua semana</Text><Text style={S.muted}>Selecione os dias e refeições que deseja planejar. Esta agenda é demonstrativa.</Text><SectionTitle title="Dias da semana"/><View style={{flexDirection:'row',flexWrap:'wrap'}}>{['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map(d=><Pill key={d} active={plan.days.includes(d)} onPress={()=>setPlan(p=>({...p,days:p.days.includes(d)?p.days.filter(x=>x!==d):[...p.days,d]}))}>{d}</Pill>)}</View><SectionTitle title="Refeições"/><View style={{flexDirection:'row',flexWrap:'wrap'}}>{['Café da manhã','Almoço','Lanche','Jantar'].map(d=><Pill key={d} active={plan.meals.includes(d)} onPress={()=>setPlan(p=>({...p,meals:p.meals.includes(d)?p.meals.filter(x=>x!==d):[...p.meals,d]}))}>{d}</Pill>)}</View><SectionTitle title="Sugestões para você"/>{meals.slice(0,3).map(m=><TouchableOpacity key={m.id} onPress={()=>openMeal(m)} style={S.optionCard}><Image source={{uri:m.image}} style={{width:64,height:64,borderRadius:12}}/><View style={{flex:1,marginLeft:12}}><Text style={S.mealName}>{m.name}</Text><Text style={S.muted}>{calculateNutrition(m,getDefaultIngredientQuantities(m)).calories} kcal · {Math.round(calculateNutrition(m,getDefaultIngredientQuantities(m)).protein)}g proteína</Text></View><Ionicons name="add-circle-outline" size={24} color={C.green}/></TouchableOpacity>)}<Button title="Salvar plano semanal" onPress={()=>{notify('Plano salvo nesta sessão');setScreen('Main')}}/></ScrollView></>;
  if(screen==='Filtro')return <><Header title="Filtrar cardápio" onBack={()=>setScreen('Main')}/><ScrollView contentContainerStyle={S.page}><Text style={S.bigTitle}>Encontre sua refeição</Text><SectionTitle title="Categoria"/>{categoryChips}<SectionTitle title="Objetivo nutricional"/><TouchableOpacity onPress={()=>setOnlyProtein(!onlyProtein)} style={S.checkRow}><Ionicons name={onlyProtein?'checkbox':'square-outline'} size={23} color={C.green}/><Text style={{marginLeft:10,color:C.text}}>Alto teor de proteína (30g ou mais)</Text></TouchableOpacity><SectionTitle title="Ordenação"/>{[{id:'recommended',name:'Recomendados'},{id:'price',name:'Menor preço'},{id:'protein',name:'Mais proteína'},{id:'calories',name:'Menos calorias'}].map(o=><TouchableOpacity key={o.id} onPress={()=>setSort(o.id)} style={S.checkRow}><Ionicons name={sort===o.id?'radio-button-on':'radio-button-off'} size={22} color={C.green}/><Text style={{marginLeft:10}}>{o.name}</Text></TouchableOpacity>)}<Button title="Aplicar filtros" onPress={()=>{setScreen('Main');setTab('Cardápio')}} style={{marginTop:22}}/><Button title="Limpar filtros" secondary onPress={()=>{setCategory('all');setOnlyProtein(false);setSort('recommended');setQuery('')}} style={{marginTop:10}}/></ScrollView></>;
  return <><Header title="Fit & Food" onBack={goBack}/><View style={S.page}><Text style={S.bigTitle}>Tela não encontrada</Text><Button title="Voltar ao início" onPress={()=>{setScreen('Main');setTab('Início')}}/></View></>;
 };
 return <View style={{flex:1,backgroundColor:C.bg}}><StatusBar barStyle={darkMode?'light-content':'dark-content'} backgroundColor={C.bg}/>{renderScreen()}{toast?<View style={S.toast}><Ionicons name="checkmark-circle" size={19} color={C.white}/><Text style={{color:C.white,fontWeight:'800',marginLeft:8}}>{toast}</Text></View>:null}</View>;
}

function MenuRow({icon,title,onPress,last}) { return <TouchableOpacity onPress={onPress} style={[S.menuRow,!last&&{borderBottomWidth:1,borderBottomColor:C.border}]}><Ionicons name={icon} size={21} color={C.green}/><Text style={{flex:1,marginLeft:12,color:C.text,fontWeight:'700'}}>{title}</Text><Ionicons name="chevron-forward" size={18} color={C.muted}/></TouchableOpacity> }
function SummaryRow({label,value,bold}) { return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:6}}><Text style={{color:bold?C.text:C.muted,fontWeight:bold?'900':'500',fontSize:bold?16:14}}>{label}</Text><Text style={{color:bold?C.green:C.text,fontWeight:bold?'900':'700',fontSize:bold?18:14}}>{value}</Text></View> }

const BASE_STYLES={
 page:{padding:20,paddingBottom:34}, authPage:{flex:1,paddingHorizontal:22,paddingTop:24,paddingBottom:20,backgroundColor:C.bg}, logo:{width:78,height:78,borderRadius:25,backgroundColor:C.mint,alignSelf:'center',alignItems:'center',justifyContent:'center',marginBottom:16}, bigTitle:{fontSize:27,fontWeight:'900',color:C.text,letterSpacing:-0.5}, sectionTitle:{fontSize:18,fontWeight:'900',color:C.text}, muted:{fontSize:13,color:C.muted,lineHeight:19}, label:{fontSize:13,fontWeight:'800',color:C.text,marginBottom:7}, input:{minHeight:49,borderRadius:13,borderWidth:1,borderColor:C.border,backgroundColor:C.white,paddingHorizontal:14,color:C.text,fontSize:14}, formCard:{backgroundColor:C.white,borderRadius:24,padding:20,borderWidth:1,borderColor:C.border}, header:{height:58,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:C.border,backgroundColor:C.white},headerIcon:{width:42,height:42,alignItems:'center',justifyContent:'center',position:'relative'},headerTitle:{fontSize:17,fontWeight:'900',color:C.text,flex:1,textAlign:'center'}, badge:{position:'absolute',top:3,right:2,minWidth:17,height:17,borderRadius:9,backgroundColor:C.orange,alignItems:'center',justifyContent:'center',paddingHorizontal:3}, greeting:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6,marginBottom:20},avatar:{width:48,height:48,borderRadius:24,backgroundColor:C.mint,alignItems:'center',justifyContent:'center'},hero:{backgroundColor:C.green,borderRadius:22,padding:20,flexDirection:'row',alignItems:'center',overflow:'hidden'},categoryGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},mealGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'stretch'},themeToggle:{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:12,borderWidth:1,borderColor:C.border,backgroundColor:C.bg,paddingHorizontal:10,paddingVertical:9,marginRight:4,minWidth:40,minHeight:40},categoryTile:{width:'48%',borderRadius:16,padding:14,marginBottom:10,minHeight:96},mealCard:{backgroundColor:C.white,borderRadius:18,borderWidth:1,borderColor:C.border,overflow:'hidden',marginBottom:14},mealImage:{width:'100%',height:165,backgroundColor:C.mint},heart:{position:'absolute',top:12,right:12,width:38,height:38,borderRadius:19,backgroundColor:C.white,alignItems:'center',justifyContent:'center'},mealName:{fontSize:15,fontWeight:'900',color:C.text,marginBottom:4},search:{backgroundColor:C.white,borderRadius:14,borderWidth:1,borderColor:C.border,paddingHorizontal:12,flexDirection:'row',alignItems:'center',marginVertical:12},empty:{alignItems:'center',justifyContent:'center',padding:36,backgroundColor:C.white,borderRadius:20,borderWidth:1,borderColor:C.border,marginTop:20},tabbar:{height:66,backgroundColor:C.white,borderTopWidth:1,borderTopColor:C.border,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:4},tabItem:{flex:1,alignItems:'center',justifyContent:'center',height:58},topbar:{height:58,backgroundColor:C.white,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18},detailImage:{width:'100%',height:230,borderRadius:20,backgroundColor:C.mint},nutrition:{flexDirection:'row',backgroundColor:C.white,borderRadius:17,borderWidth:1,borderColor:C.border,paddingVertical:16,marginTop:18},checkRow:{flexDirection:'row',alignItems:'center',paddingVertical:11},cartRow:{flexDirection:'row',backgroundColor:C.white,borderRadius:17,padding:12,marginBottom:12,borderWidth:1,borderColor:C.border},summary:{backgroundColor:C.white,borderRadius:17,padding:17,borderWidth:1,borderColor:C.border,marginVertical:18},line:{height:1,backgroundColor:C.border,marginVertical:10},optionCard:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.border,borderRadius:17,padding:16,marginTop:12},optionSelected:{borderColor:C.green,backgroundColor:'#F0F8F2',borderWidth:1.5},successCircle:{width:90,height:90,borderRadius:45,backgroundColor:C.green,alignItems:'center',justifyContent:'center',alignSelf:'center'},orderCard:{backgroundColor:C.white,borderRadius:17,borderWidth:1,borderColor:C.border,padding:16,marginTop:14},profileHead:{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderRadius:18,padding:16,marginTop:20,borderWidth:1,borderColor:C.border},menuBox:{backgroundColor:C.white,borderRadius:18,borderWidth:1,borderColor:C.border,marginTop:18,overflow:'hidden'},menuRow:{minHeight:58,flexDirection:'row',alignItems:'center',paddingHorizontal:16},toast:{position:'absolute',bottom:80,left:20,right:20,backgroundColor:C.text,borderRadius:13,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'center',elevation:6}
};

function adaptStyleColors(value) {
  if (Array.isArray(value)) return value.map(adaptStyleColors);
  if (value && typeof value === 'object') {
    const result = {};
    Object.keys(value).forEach(key => { result[key] = adaptStyleColors(value[key]); });
    return result;
  }
  if (typeof value === 'string') {
    for (const key of Object.keys(LIGHT_C)) {
      if (value.toLowerCase() === LIGHT_C[key].toLowerCase()) return C[key];
    }
    if (C === DARK_C) {
      const extraColors = { '#F0F8F2':'#243C31', '#D8F0DF':'#D4EADF', '#E8F7EC':'#E0F0E5' };
      return extraColors[value.toUpperCase()] || value;
    }
  }
  return value;
}
const S = new Proxy(BASE_STYLES, {
  get(target, property) { return adaptStyleColors(target[property]); }
});

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Erro de renderização no Fit & Food:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#F5F7F3', padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#C94B4B', marginBottom: 12 }}>O Fit & Food encontrou um erro</Text>
          <Text style={{ fontSize: 15, color: '#1C2B23', marginBottom: 8 }}>A mensagem abaixo ajuda a identificar o problema:</Text>
          <Text selectable style={{ fontSize: 13, color: '#1C2B23', lineHeight: 20 }}>{String(this.state.error?.message || this.state.error)}</Text>
          <Text style={{ fontSize: 12, color: '#758179', marginTop: 18 }}>Abra o console do navegador (F12 → Console) para ver os detalhes completos.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return <AppErrorBoundary><AppContent /></AppErrorBoundary>;
}




