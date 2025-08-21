import ActivityKit
import SwiftUI
import WidgetKit

// PAAS green
extension Color {
    static let paasGreen = Color(red: 87/255, green: 150/255, blue: 54/255, opacity: 1)
}

struct GreenProgressViewStyle: ProgressViewStyle {
    func makeBody(configuration: Configuration) -> some View {
        ProgressView(configuration)
            .tint(Color.paasGreen)
    }
}
struct FormattedDate: View {
    let date: Date
    let locale: String
    let type: String

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = locale  == "sk" ? "EEE d. M. HH:mm" : "MMM d, HH:mm"
        formatter.locale = Locale(identifier: locale)
        
        return formatter.string(from: date)
    }
    
    private func getTextBasedOnLocale() -> String {
        switch locale {
        case "sk":
            return type == "from" ? "Od" : "Do"
        default:
            return type == "from" ? "From" : "To"
        }
    }

    var body: some View {
        VStack {
            Text(getTextBasedOnLocale())
                .font(.system(size: 14))
                .foregroundColor(.secondary)
            Text(formatDate(date))
                .font(.system(size: 16, weight: .medium))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 18)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(UIColor.systemGray6))
        )
    }
}

struct StaleTicketText: View {
    let context: ActivityViewContext<Attributes>

    var body: some View {
        HStack {
            Text(context.state.locale == "en" ? "The parking ticket has expired." : "Parkovací lístok vypršal.")
                .font(.system(size: 16, weight: .semibold))

            Spacer()
        }
        .padding(.vertical, 4)
    }
}

struct ActivityView: View {
    let context: ActivityViewContext<Attributes>
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack {
            HStack {
                Image("Icon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 44, height: 32)
                Spacer()

                HStack(spacing: 12) {
                    Image("CarIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 20, height: 20)
                    Text(context.state.licencePlate)
                        .font(.system(size: 14, weight: .medium))
                }

                Spacer()

                HStack(spacing: 12) {
                    Image("ParkingIcon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 20, height: 20)
                    Text(context.state.parkingLocation)
                        .font(.system(size: 14, weight: .medium))
                }
            }
            if context.isStale {
                StaleTicketText(context: context)
            } else {
                ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: true)
                    .progressViewStyle(GreenProgressViewStyle())
            }

            HStack {
                FormattedDate(date: context.state.startTime, locale: context.state.locale, type: "from")

                Spacer()

                FormattedDate(date: context.state.endTime, locale: context.state.locale, type: "to")
            }
        }
        .padding(.all, 12)
    }
}

struct IslandBottom: View {
    let context: ActivityViewContext<Attributes>

    var body: some View {
        VStack {
            if context.isStale {
                StaleTicketText(context: context)
            } else {
                ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: true)
                    .progressViewStyle(GreenProgressViewStyle())
            }

            HStack {
                FormattedDate(date: context.state.startTime, locale: context.state.locale, type: "from")

                Spacer()

                FormattedDate(date: context.state.endTime, locale: context.state.locale, type: "to")
            }
        }
    }
}

struct LiveWidget: Widget {
    let kind: String = "_Widget"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: Attributes.self) { context in
            ActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 12) {
                        Image("CarIcon")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 20, height: 20)
                        Text(context.state.licencePlate)
                            .font(.system(size: 14, weight: .medium))
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    HStack(spacing: 12) {
                        Image("ParkingIcon")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 20, height: 20)
                        Text(context.state.parkingLocation)
                            .font(.system(size: 14, weight: .medium)).truncationMode(.tail)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    IslandBottom(context: context)
                }
            } compactLeading: {
                Image("Icon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 20)
            } compactTrailing: {
                if(context.isStale) {
                    Text("0 min")
                        .font(.system(size: 14))
                }
                else{
                    ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: true, label: {EmptyView()},
                                 currentValueLabel: {EmptyView()})
                        .progressViewStyle(CircularProgressViewStyle()).tint(Color.paasGreen)
                }
            } minimal: {
                Image("Icon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 16)
            }
            .widgetURL(URL(string: context.isStale ? "paasmpa://tickets?tab=history" : "paasmpa://tickets?tab=active"))
        }
    }
}

private extension Attributes {
    static var preview: Attributes {
        Attributes()
    }
}

private extension Attributes.ContentState {
    static var state: Attributes.ContentState {
    Attributes.ContentState(startTime: Date(timeIntervalSinceNow: 0), endTime: Date(timeIntervalSinceNow: 120), licencePlate: "BT999AA", parkingLocation: "Špitálska", locale: "en")
    }
}

struct ActivityView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .content)
                .previewDisplayName("Content View")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.compact))
                .previewDisplayName("Dynamic Island Compact")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.expanded))
                .previewDisplayName("Dynamic Island Expanded")

            Attributes.preview
                .previewContext(Attributes.ContentState.state, viewKind: .dynamicIsland(.minimal))
                .previewDisplayName("Dynamic Island Minimal")
        }
    }
}
