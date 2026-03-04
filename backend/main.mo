import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type MusicAnalysis = {
    rhythm : Text;
    tempo : Nat;
    emotion : Text;
    genre : Text;
  };

  module MusicAnalysis {
    public func compare(analysis1 : MusicAnalysis, analysis2 : MusicAnalysis) : Order.Order {
      switch (Text.compare(analysis1.genre, analysis2.genre)) {
        case (#equal) { Text.compare(analysis1.emotion, analysis2.emotion) };
	      case (order) { order };
      };
    };
  };

  type VideoRecord = {
    id : Text;
    user : Principal;
    audioFile : Storage.ExternalBlob;
    videoFile : ?Storage.ExternalBlob;
    analysis : MusicAnalysis;
  };

  module VideoRecord {
    public func compare(record1 : VideoRecord, record2 : VideoRecord) : Order.Order {
      if (record1.id < record2.id) { #less } else {
        if (record1.id > record2.id) { #greater } else {
          Text.compare(record1.analysis.genre, record2.analysis.genre);
        };
      };
    };
  };

  let videoRecords = Map.empty<Text, VideoRecord>();

  public type UploadResult = {
    id : Text;
    audioFile : Storage.ExternalBlob;
    analysis : MusicAnalysis;
  };

  public shared ({ caller }) func uploadAudio(id : Text, audioFile : Storage.ExternalBlob) : async UploadResult {
    if (videoRecords.containsKey(id)) {
      Runtime.trap("Video record with this ID already exists. ");
    };

    let analysis : MusicAnalysis = analyzeAudio(audioFile);
    let record : VideoRecord = {
      id;
      user = caller;
      audioFile;
      videoFile = null;
      analysis;
    };
    videoRecords.add(id, record);
    { id; audioFile; analysis };
  };

  func analyzeAudio(_audioFile : Storage.ExternalBlob) : MusicAnalysis {
    {
      rhythm = "4/4";
      tempo = 120;
      emotion = "uplifting";
      genre = "rock";
    };
  };

  public query ({ caller }) func getVideo(id : Text) : async VideoRecord {
    switch (videoRecords.get(id)) {
      case (null) { Runtime.trap("Video record does not exist. ") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getAllVideos() : async [VideoRecord] {
    videoRecords.values().toArray().sort();
  };
};
