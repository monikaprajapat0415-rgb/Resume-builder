import SwiftUI

struct RecipeListView: View {
    @State private var model = RecipeViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Recipe Book")
                .searchable(text: $model.query, prompt: "Try chicken or pasta")
                .onChange(of: model.query) { _, _ in model.queryChanged() }
                .navigationDestination(for: Recipe.self) { RecipeDetailView(recipe: $0) }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch model.state {
        case .idle:
            ContentUnavailableView("Search for a dish", systemImage: "fork.knife",
                                   description: Text("Type at least two letters."))
        case .loading:
            ProgressView("Searching...")
        case .failed(let message):
            ContentUnavailableView("Could not load recipes", systemImage: "wifi.exclamationmark",
                                   description: Text(message))
        case .loaded(let recipes):
            if recipes.isEmpty {
                ContentUnavailableView.search(text: model.query)
            } else {
                List(recipes) { recipe in
                    NavigationLink(value: recipe) {
                        HStack(spacing: 12) {
                            AsyncImage(url: recipe.thumbnail) { image in
                                image.resizable().scaledToFill()
                            } placeholder: {
                                Color.gray.opacity(0.2)
                            }
                            .frame(width: 56, height: 56)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            VStack(alignment: .leading) {
                                Text(recipe.name).font(.headline)
                                Text([recipe.category, recipe.area].compactMap { $0 }.joined(separator: " · "))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
        }
    }
}

struct RecipeDetailView: View {
    let recipe: Recipe

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                AsyncImage(url: recipe.thumbnail) { image in
                    image.resizable().scaledToFit()
                } placeholder: {
                    ProgressView()
                }
                .frame(maxWidth: .infinity)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                Text("Instructions").font(.title3.bold())
                Text(recipe.instructions ?? "No instructions were provided.")
            }
            .padding()
        }
        .navigationTitle(recipe.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
