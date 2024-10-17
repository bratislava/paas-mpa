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
            .widgetURL(URL(string: context.isStale ? "com.bratislava.paas://tickets?tab=history" : "com.bratislava.paas://tickets?tab=active"))
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
        Attributes.ContentState(startTime: Date(timeIntervalSince1970: TimeInterval(1727093160)), endTime: Date(timeIntervalSince1970: TimeInterval(1727094060)), licencePlate: "BT999AA", parkingLocation: "Špitálska")
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
