require "sinatra"
require "json"

set :bind, "0.0.0.0"
set :port, 4567

CARDS = Dir["cards/en/*.json"].map do |path|
  JSON.parse(File.read(path))
end.flatten

get "/" do
  "Welcome to your Pokémon TCG API!"
end

# Get all cards
get "/cards" do
  content_type :json
  CARDS.to_json
end

# Get a card by ID
get "/cards/:id" do
  card = CARDS.find { |c| c["id"] == params["id"] }
  if card
    content_type :json
    card.to_json
  else
    halt 404, { error: "Card not found" }.to_json
  end
end
