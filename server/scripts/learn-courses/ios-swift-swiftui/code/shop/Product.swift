import Foundation

struct Product: Identifiable, Codable, Hashable {
    let id: Int
    let title: String
    let price: Double
    let description: String
    let category: String
    let image: URL

    // Money is kept in whole cents everywhere in the cart, so there are no rounding surprises.
    var priceCents: Int { Int((price * 100).rounded()) }
}

struct CartLine: Identifiable, Codable, Equatable {
    let productID: Int
    let title: String
    let priceCents: Int
    var quantity: Int

    var id: Int { productID }
    var lineTotalCents: Int { priceCents * quantity }
}

extension Int {
    // 4990 -> "$49.90"
    var asMoney: String {
        let sign = self < 0 ? "-" : ""
        let value = abs(self)
        return "\(sign)$\(value / 100).\(String(format: "%02d", value % 100))"
    }
}
