import './Menu.css'

const menuItems = [
  {
    category: 'Hot Coffee',
    items: [
      { name: 'Espresso', price: '$3.50', description: 'Rich and bold single shot' },
      { name: 'Cappuccino', price: '$4.50', description: 'Espresso with steamed milk foam' },
      { name: 'Latte', price: '$4.75', description: 'Smooth espresso with creamy milk' },
      { name: 'Mocha', price: '$5.25', description: 'Espresso, chocolate, and steamed milk' },
    ],
  },
  {
    category: 'Cold Brew',
    items: [
      { name: 'Classic Cold Brew', price: '$4.50', description: 'Slow-steeped for 20 hours' },
      { name: 'Iced Latte', price: '$5.00', description: 'Espresso over ice with milk' },
      { name: 'Frappuccino', price: '$5.50', description: 'Blended coffee with cream' },
      { name: 'Nitro Brew', price: '$5.75', description: 'Cold brew infused with nitrogen' },
    ],
  },
  {
    category: 'Pastries',
    items: [
      { name: 'Butter Croissant', price: '$3.25', description: 'Flaky, golden, and buttery' },
      { name: 'Blueberry Muffin', price: '$3.50', description: 'Fresh blueberries in every bite' },
      { name: 'Cinnamon Roll', price: '$4.00', description: 'Warm with cream cheese icing' },
      { name: 'Banana Bread', price: '$3.75', description: 'Homemade with walnuts' },
    ],
  },
]

function Menu() {
  return (
    <section id="menu" className="menu">
      <div className="container">
        <h2 className="section-title">Our Menu</h2>
        <p className="section-subtitle">Handcrafted beverages and fresh baked goods</p>
        <div className="menu__grid">
          {menuItems.map((category) => (
            <div key={category.category} className="menu__category">
              <h3 className="menu__category-title">{category.category}</h3>
              <ul className="menu__list">
                {category.items.map((item) => (
                  <li key={item.name} className="menu__item">
                    <div className="menu__item-header">
                      <span className="menu__item-name">{item.name}</span>
                      <span className="menu__item-price">{item.price}</span>
                    </div>
                    <p className="menu__item-description">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
