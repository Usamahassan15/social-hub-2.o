import 'package:freezed_annotation/freezed_annotation.dart';

part 'driver_model.freezed.dart';
part 'driver_model.g.dart';

@freezed
class DriverModel with _$DriverModel {
  const factory DriverModel({
    @JsonKey(name: 'id') required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'first_name') required String firstName,
    @JsonKey(name: 'last_name') required String lastName,
    @JsonKey(name: 'photo_url') String? photoUrl,
    @JsonKey(name: 'dob') String? dob,
    @JsonKey(name: 'referral_code') String? referralCode,
    @JsonKey(name: 'status') required String status,
    @JsonKey(name: 'wallet_balance') @Default(0.0) double walletBalance,
    @JsonKey(name: 'categories') @Default([]) List<String> categories,
    @JsonKey(name: 'vehicle_no') String? vehicleNo,
    @JsonKey(name: 'registration_plate') String? registrationPlate,
    @JsonKey(name: 'vehicle_front_url') String? vehicleFrontUrl,
    @JsonKey(name: 'vehicle_back_url') String? vehicleBackUrl,
    @JsonKey(name: 'vehicle_doc_url') String? vehicleDocUrl,
    @JsonKey(name: 'vehicle_doc_expiry') String? vehicleDocExpiry,
    @JsonKey(name: 'id_front_url') String? idFrontUrl,
    @JsonKey(name: 'id_back_url') String? idBackUrl,
    @JsonKey(name: 'id_expiry') String? idExpiry,
    @JsonKey(name: 'license_front_url') String? licenseFrontUrl,
    @JsonKey(name: 'license_back_url') String? licenseBackUrl,
    @JsonKey(name: 'license_expiry') String? licenseExpiry,
    @JsonKey(name: 'selfie_url') String? selfieUrl,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _DriverModel;

  factory DriverModel.fromJson(Map<String, dynamic> json) => _$DriverModelFromJson(json);
}
