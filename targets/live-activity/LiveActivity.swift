import ActivityKit
import SwiftUI
import WidgetKit

struct  TextTimer: View {
    private static func maxStringFor(_ time: TimeInterval) -> String {
        if time < 600 { // 9:99
            return "0:00"
        }
        
        if time < 3600 { // 59:59
            return "00:00"
        }
        
        if time < 36000 { // 9:59:59
            return "0:00:00"
        }
        
        return "00:00:00" // 99:59:59
    }
    
    init(_ date: Date, font: UIFont, width: CGFloat? = nil) {
        self.date = date
        self.font = font
        
        if let width = width {
            self.width = width
        } else {
            let fontAttributes = [NSAttributedString.Key.font: font]
            let time = date.timeIntervalSinceNow
            let maxString = Self.maxStringFor(time)
            self.width = (maxString as NSString).size(withAttributes: fontAttributes).width
        }
    }
    
    let date: Date
    let font: UIFont
    let width: CGFloat
    
    var body: some View {
        Text(timerInterval: Date.now...date, countsDown: true)
            .font(Font(font))
            .frame(width: width > 0 ? width : nil)
            .minimumScaleFactor(0.5)
            .lineLimit(1)
    }
}


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
struct ActivityView: View {
    let context: ActivityViewContext<Attributes>
    @Environment(\.colorScheme) var colorScheme

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, HH:mm"
        return formatter.string(from: date)
    }

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

            ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: true)
                .progressViewStyle(GreenProgressViewStyle())

            HStack {
                VStack {
                    Text("From")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    Text(formatDate(context.state.startTime))
                        .font(.system(size: 16, weight: .medium))
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 18)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(UIColor.systemGray6))
                )

                Spacer()

                VStack {
                    Text("To")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    Text(formatDate(context.state.endTime))
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
        .padding(.all, 12)
    }
}

struct IslandBottom: View {
    let context: ActivityViewContext<Attributes>
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, HH:mm"
        return formatter.string(from: date)
    }

    var body: some View {
        VStack {
            ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: true)
                .progressViewStyle(GreenProgressViewStyle())

            HStack {
                VStack {
                    Text("From")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    Text(formatDate(context.state.startTime))
                        .font(.system(size: 16, weight: .medium))
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 18)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(UIColor.systemGray6))
                )

                Spacer()

                VStack {
                    Text("To")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                    Text(formatDate(context.state.endTime))
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
               TextTimer(context.state.endTime, font: .systemFont(ofSize: 14))
            } minimal: {
                Image("Icon")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 16)
            }
            .widgetURL(URL(string: context.state.widgetUrl))
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
        Attributes.ContentState(startTime: Date(timeIntervalSince1970: TimeInterval(1727093160)), endTime: Date(timeIntervalSince1970: TimeInterval(1727094060)), licencePlate: "BT999AA", parkingLocation: "Špitálska", widgetUrl: "https://www.apple.com")
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
