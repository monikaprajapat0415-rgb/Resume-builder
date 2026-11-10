import SwiftUI

struct ShopRootView: View {
    @State private var cart = CartStore()
    @State private var shop = ShopViewModel()

    var body: some View {
        TabView {
            ProductGridView(shop: shop, cart: cart)
                .tabItem { Label("Shop", systemImage: "bag") }
            CartView(cart: cart)
                .tabItem { Label("Cart", systemImage: "cart") }
                .badge(cart.itemCount)
        }
        .task { await shop.load() }
    }
}

struct ProductGridView: View {
    let shop: ShopViewModel
    let cart: CartStore
    private let columns = [GridItem(.adaptive(minimum: 150), spacing: 12)]

    var body: some View {
        NavigationStack {
            Group {
                switch shop.state {
                case .loading:
                    ProgressView("Loading products...")
                case .failed(let message):
                    VStack(spacing: 12) {
                        Text(message).multilineTextAlignment(.center)
                        Button("Try again") { Task { await shop.load() } }
                            .buttonStyle(.borderedProminent)
                    }
                    .padding()
                case .ready(let products):
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(products) { product in
                                ProductCard(product: product) { cart.add(product) }
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Shop")
        }
    }
}

struct ProductCard: View {
    let product: Product
    let onAdd: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            AsyncImage(url: product.image) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                ProgressView()
            }
            .frame(height: 110)
            .frame(maxWidth: .infinity)
            Text(product.title)
                .font(.subheadline)
                .lineLimit(2)
            Text(product.priceCents.asMoney)
                .font(.headline)
            Button("Add to cart", action: onAdd)
                .buttonStyle(.borderedProminent)
                .controlSize(.small)
        }
        .padding(10)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 12))
    }
}

struct CartView: View {
    let cart: CartStore
    @State private var message: String?

    var body: some View {
        NavigationStack {
            Group {
                if cart.lines.isEmpty {
                    ContentUnavailableView("Your cart is empty", systemImage: "cart",
                                           description: Text(message ?? "Add something from the Shop tab."))
                } else {
                    List {
                        ForEach(cart.lines) { line in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(line.title).lineLimit(2)
                                    Text(line.lineTotalCents.asMoney).font(.caption)
                                }
                                Spacer()
                                Stepper("", onIncrement: { cart.change(line, by: 1) },
                                        onDecrement: { cart.change(line, by: -1) })
                                    .labelsHidden()
                                Text("\(line.quantity)").frame(minWidth: 24)
                            }
                        }
                        Section {
                            HStack {
                                Text("Total").font(.headline)
                                Spacer()
                                Text(cart.totalCents.asMoney).font(.headline)
                            }
                            Button("Place demo order") {
                                cart.placeDemoOrder()
                                message = "Demo order placed. No payment was taken."
                            }
                        }
                    }
                }
            }
            .navigationTitle("Cart")
        }
    }
}
