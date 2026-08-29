import 'package:freezed_annotation/freezed_annotation.dart';

part 'ride_request_model.freezed.dart';
part 'ride_request_model.g.dart';

@freezed
class RideRequestModel with _$RideRequestModel {
  const factory RideRequestModel({
    @JsonKey(name: 'id') required String id,
    @JsonKey(name: 'passenger_id') required String passengerId,
    @JsonKey(name: 'passenger_name') String? passengerName,
    @JsonKey(name: 'driver_id') String? driverId,
    @JsonKey(name: 'service_type') required String serviceType,
    @JsonKey(name: 'status') required String status,
    @JsonKey(name: 'category') String? category,
    @JsonKey(name: 'description') String? description,
    @JsonKey(name: 'from_address') String? fromAddress,
    @JsonKey(name: 'to_address') String? toAddress,
    @JsonKey(name: 'from_lat') double? fromLat,
    @JsonKey(name: 'from_lng') double? fromLng,
    @JsonKey(name: 'to_lat') double? toLat,
    @JsonKey(name: 'to_lng') double? toLng,
    @JsonKey(name: 'distance_km') double? distanceKm,
    @JsonKey(name: 'fare') double? fare,
    @JsonKey(name: 'vehicle_size') String? vehicleSize,
    @JsonKey(name: 'loading_address') String? loadingAddress,
    @JsonKey(name: 'loading_city') String? loadingCity,
    @JsonKey(name: 'recipient_name') String? recipientName,
    @JsonKey(name: 'recipient_phone') String? recipientPhone,
    @JsonKey(name: 'schedule_at') DateTime? scheduleAt,
    @JsonKey(name: 'chat_enabled') @Default(true) bool chatEnabled,
    @JsonKey(name: 'accepted_offer_id') String? acceptedOfferId,
    @JsonKey(name: 'options') List<String>? options,
    @JsonKey(name: 'photos') List<String>? photos,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _RideRequestModel;

  factory RideRequestModel.fromJson(Map<String, dynamic> json) => _$RideRequestModelFromJson(json);
}
